import bcrypt from "bcrypt";
import Database from "better-sqlite3";

const db = new Database("../data/data.db");
const saltRounds = 4;
db.pragma("journal_mode = WAL");

// db.prepare('DROP TA')
const stmt = db.prepare(`
    CREATE TABLE temp_accounts (
        username TEXT PRIMARY KEY,
        password TEXT,
        created_at TEXT DEFAULT (datetime('now', 'localtime'))
    )
    `).run();



const accounts = db
  .prepare(
    `
    SELECT * FROM accounts
    `
  )
  .all();

const insertStmt = db.prepare(`
    INSERT INTO temp_accounts (username, password)
    VALUES (?, ?)    
    `);

// console.log(">>>Muoi: ", salt);

for (const account of accounts) {
  console.log(account.username, account.password);

  bcrypt.hash(account.password, saltRounds, (err, hash) => {
    console.log(">>>Bam", hash);
    insertStmt.run(account.username, hash);
  });
}
