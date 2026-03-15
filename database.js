const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./safety_tracker.db",(err)=>{
if(err){
console.log(err.message)
}else{
console.log("Connected to SQLite database")
}
})

/* STUDENTS */

db.run(`
CREATE TABLE IF NOT EXISTS students(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
roll TEXT UNIQUE,
gender TEXT,
father TEXT,
mother TEXT,
parentPhone TEXT,
password TEXT
)
`)

/* PARENTS */

db.run(`
CREATE TABLE IF NOT EXISTS parents(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
studentRoll TEXT,
password TEXT
)
`)

/* FACULTY */

db.run(`
CREATE TABLE IF NOT EXISTS faculty(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
mobile TEXT,
password TEXT
)
`)

/* GPS TRACKING */

db.run(`
CREATE TABLE IF NOT EXISTS tracking(
id INTEGER PRIMARY KEY AUTOINCREMENT,
roll TEXT,
latitude REAL,
longitude REAL,
time TEXT,
status TEXT
)
`)

module.exports = db
