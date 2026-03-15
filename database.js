const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./safety_tracker.db",(err)=>{

if(err){
console.log(err.message)
}
else{
console.log("Connected to SQLite database")
}

})

/* USERS TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
roll TEXT UNIQUE,
parentName TEXT,
phone TEXT,
password TEXT
)
`)

/* GPS TRACKING TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS tracking (
id INTEGER PRIMARY KEY AUTOINCREMENT,
roll TEXT,
latitude REAL,
longitude REAL,
time TEXT
)
`)

module.exports = db;
