CREATE TABLE accounts (
    username    TEXT    PRIMARY KEY,
    password    TEXT
);

CREATE TABLE likes (
    id          INTEGER    PRIMARY KEY,
    username    TEXT    REFERENCES accounts(username),
    post_id     INTEGER  REFERENCES posts(id), 
    UNIQUE(username, post_id)
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    username TEXT REFERENCES accounts(username),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);