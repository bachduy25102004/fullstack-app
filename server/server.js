import { urlencoded } from "express";
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";

const app = express();
const PORT = 4000;
const db = new Database("./data/data.db");
db.pragma("journal_mode = WAL");

app.use(
  cors({
    origin: "http://localhost:3000",
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
    secret: "Nuh uh",
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

app.use((req, res, next) => {
  // console.log(req.session);
  next();
});

app.post("/signup", (req, res) => {
  // console.log('Server started');
  const { name, pwd } = req.body;
  const stmt = db.prepare("INSERT INTO accounts VALUES(?, ?)");
  stmt.run(name, pwd);

  return res.send("Signup Successfully");
});

app.post("/login", (req, res) => {
  const { name, pwd } = req.body;
  const stmt = db.prepare("SELECT password FROM accounts WHERE username = ?");
  const response = stmt.get(name);
  // console.log(req.body);

  if (!response) return res.send("Account does not exist");

  if (pwd !== response.password) return res.send("Incorrect password");

  req.session.user = {
    username: name,
    isLoggedIn: true,
  };
  // console.log(">>>>User: ", req.session.user);

  return res.status(200).send("login successfully! ");
});

app.get("/authen", (req, res) => {
  if (req.session.user && req.session.user.isLoggedIn)
    return res.json(req.session.user);

  return res.json(false);
});

app.get('/users/:username/posts', (req, res) => {
  const { username } = req.params;
  const stmt = db.prepare(`
    SELECT * 
    FROM posts 
    WHERE username = ? 
    ORDER BY created_at DESC`
  );
  const userPosts = stmt.all(username);

  return res.status(200).json(userPosts);
})

app.get('/newsfeed', (req, res) => {
  // if (req.session.user && req.session.user.isLoggedIn) {
    const stmt = db.prepare(`SELECT * FROM posts ORDER BY created_at DESC`);
    const posts = stmt.all();
    console.log('posts:', posts);  

    return res.status(200).json(posts);
        
  // }
return res.status(400).json({ error: 'Error!!!'});

})

app.post('/posts/new', (req, res) => {
  const { title, content } = req.body;

  console.log(title, content);
  

  if (!title || !content)
    return res.status(400).json({ error: 'Missing post data' });

  const { username } = req.session.user;

  if (!username)
    return res.status(422).json({ error: 'You must be logged in' });

  console.log(title, content, username);

  const statement = db.prepare(`
    INSERT INTO posts (title, content, username) 
    VALUES (?, ?, ?)
    RETURNING id
  `);

  const row = statement.get(title, content, username); 

  return res.status(201).json({ post_id: row.id });
});

app.get('/posts', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM posts
    ORDER BY created_at DESC
    LIMIT 10
  `);

  const rows = statement.all();

  return res.json(rows);
});

app.get("/users", (req, res) => {
  if (req.session.user && req.session.user.isLoggedIn) {
    const statement = db.prepare("SELECT username FROM accounts");
    const users = statement.all();

    return res.json(users);
  }

  return res.status(401).send("error");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
