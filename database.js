const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./safety_tracker.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    roll TEXT UNIQUE,
    password TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roll TEXT,
    latitude REAL,
    longitude REAL,
    time TEXT
)
`);

module.exports = db;
