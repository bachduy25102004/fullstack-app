import { urlencoded } from "express";
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import morgan from "morgan";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT;
const db = new Database(process.env.DB_URL);
// const bcrypt = require("bcrypt");
const saltRounds = 3;

db.pragma("journal_mode = WAL");

app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(urlencoded());
app.use(express.json());

const SQLiteStore = SQLiteStoreFactory(session);

app.use(
  session({
    store: new SQLiteStore({
      db: "data.db",
      dir: "./data",
      table: "sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

function requireLogin(req, res, next) {
  if (!req.session.user || !req.session.user.isLoggedIn) {
    return res.status(401).json({ error: "not logged in" });
  }

  next();
}

function isPostAuthor(req, res, next) {
  const { id } = req.params;

  const post = db
    .prepare(
      `
    SELECT username
    FROM posts
    WHERE id = ?
  `
    )
    .get(id);

  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }

  if (post.username !== req.session.user.username) {
    return res.status(403).json({ error: "not author" });
  }

  next();
}

app.post("/signup", (req, res) => {
  // console.log('Server started');
  const { username, pwd } = req.body;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    console.log(salt);

    bcrypt.hash(pwd, salt, (err, hashedPwd) => {
      // hash = this.hash;
      console.log(hashedPwd);
      const stmt = db.prepare("INSERT INTO accounts(username, password) VALUES(?, ?)");
      stmt.run(username, hashedPwd);

      return res.send("Signup Successfully");
    });
  });
});

app.post("/login", (req, res) => {
  const { name, pwd } = req.body;
  const stmt = db.prepare("SELECT password FROM accounts WHERE username = ?");
  const response = stmt.get(name);
  // console.log(req.body);

  if (!response) return res.send("Account does not exist");

  bcrypt.compare(pwd, response.password, (err, result) => {
    if (result) {
      req.session.user = {
        username: name,
        isLoggedIn: true,
      };
      return res.status(200).json({ response: "ok" });
    }
    return res.status(400).json({ response: "error  " });
  });

  // if (pwd !== response.password) return res.send("Incorrect password");

  // console.log(">>>>User: ", req.session.user);

  // return res.status(200).send("login successfully! ");
});

app.get("/authen", (req, res) => {
  if (req.session.user && req.session.user.isLoggedIn)
    return res.json(req.session.user);

  return res.json(false);
});

app.get("/users/:name/posts", (req, res) => {
  const { name } = req.params;
  const stmt = db.prepare(`
    SELECT
      posts.*,
    EXISTS (
      SELECT 1
      FROM likes l
      WHERE l.post_id = posts.id
      AND l.username = ?
    ) AS isLiked
    FROM posts
    WHERE username = ? ;`);
  const userPosts = stmt.all(name, name);
  
  for (const post of userPosts) {
    post.isLiked = post.isLiked === 1;
    console.log(userPosts);
  }
  return res.status(200).json(userPosts);
});

app.get("/newsfeed", (req, res) => {
  // if (req.session.user && req.session.user.isLoggedIn) {
  const stmt = db.prepare(`SELECT * FROM posts ORDER BY created_at DESC`);
  const posts = stmt.all();
  console.log("posts:", posts);

  return res.status(200).json(posts);

  // }
  return res.status(400).json({ error: "Error!!!" });
});

app.post("/posts/new", (req, res) => {
  const { title, content } = req.body;

  console.log(title, content);

  if (!title || !content)
    return res.status(400).json({ error: "Missing post data" });

  const { username } = req.session.user;

  if (!username)
    return res.status(422).json({ error: "You must be logged in" });

  console.log(title, content, username);

  const statement = db.prepare(`
    INSERT INTO posts (title, content, username) 
    VALUES (?, ?, ?)
    RETURNING id
  `);

  const row = statement.get(title, content, username);

  return res.status(201).json({ post_id: row.id });
});

app.get("/posts", (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM posts
    ORDER BY created_at DESC
    LIMIT 10
  `);

  const rows = statement.all();

  return res.json(rows);
});

app.get("/all-posts", (req, res) => {
  const stmt = db.prepare(`
    SELECT * FROM posts
    `);
  const result = stmt.all();
  return res.status(200).json(result);
});

app.get("/posts/:name/liked-posts", requireLogin, (req, res) => {
  const { name } = req.params;
  const stmt = db.prepare(`
    SELECT posts.*
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE likes.username = ?
    ORDER BY created_at DESC
  `);

  const likedPosts = stmt.all(name).map((post) => ({
    ...post,
    isLiked: true,
  }));

  console.log(">>>Watch here: ", likedPosts);

  return res.status(200).json(likedPosts);
});

app.put("/posts/users/:id/edit", requireLogin, isPostAuthor, (req, res) => {
  const { id, newTitle, newContent } = req.body;
  console.log("VALUES: ", id, newTitle, newContent);

  const stmt = db.prepare(`
    UPDATE posts
    SET title = ?,
        content = ?
    WHERE id = ?
    RETURNING username, title, content, created_at
  `);

  const result = stmt.get(newTitle, newContent, id);

  if (result) return res.status(200).json(result);
  else return res.status(404).json({ status: "failed" });
});

app.delete(
  "/posts/users/:id/delete",
  requireLogin,
  isPostAuthor,
  (req, res) => {
    const { id } = req.params;
    const user = req.session.username;
    console.log("id ne`", id);

    const stmt = db.prepare("DELETE FROM posts WHERE id = ? RETURNING id");
    const result = stmt.get(id);

    if (!result) return res.status(404).json({ error: "delete failed" });

    return res.status(200).json({ id });
  }
);

app.post("/posts/:id/like", requireLogin, (req, res) => {
  const { id } = req.params;
  const username = req.session.user.username;

  const stmt = db.prepare(`
    INSERT INTO likes (username, post_id)
    VALUES (?, ?)
    RETURNING id
    `);
  const result = stmt.get(username, id);

  if (!result) return res.status(404).json({ error: "like failed" });

  return res.status(200).json({ result });
});

app.get('/post/:id/comment', (req, res) => {
  const stmt = db.prepare(`
    SELECT *
    FROM comments
    ORDER BY created_at DESC
    `);

    const result = stmt.all();

    return res.status(200).json(result);
})

app.post('/post/:id/comment', requireLogin, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const username = req.session.user.username;

  console.log(id, content, username);
  
  const stmt = db.prepare(`
    INSERT INTO comments (username, post_id, content)
    VALUES (?, ?, ?)
    RETURNING id, username, post_id, content, created_at
    `);

  const result = stmt.get(username, id, content);
  console.log();
  

  if (!result) return res.status(404).json({ error: 'comment failed'});
  
  return res.status(200).json(result);


})

app.delete("/posts/:id/like", requireLogin, (req, res) => {
  const { id } = req.params;
  const username = req.session.user.username;

  console.log(id, username);

  const stmt = db.prepare(`
    DELETE FROM likes 
    WHERE post_id = ? AND username = ?
    RETURNING id
    `);
  const result = stmt.get(id, username);

  if (!result) {
    console.log("failed");

    return res.status(404).json({ error: "unlike failed" });
  }

  return res.status(200).json({ result });
});

app.get("/users", (req, res) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    const statement = db.prepare("SELECT username FROM accounts");
    const users = statement.all();

    return res.json(users);
  }

  return res.status(401).send("error");
});

app.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
  return res.status(200).json({ message: 'succeed'});    
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
