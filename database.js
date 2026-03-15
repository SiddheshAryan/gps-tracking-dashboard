const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.db",(err)=>{

if(err){
console.log("Database error")
}

else{
console.log("Connected to SQLite database")
}

})

/* STUDENTS TABLE */

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

/* PARENTS TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS parents(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
studentRoll TEXT,
password TEXT
)
`)

/* FACULTY TABLE */

db.run(`
CREATE TABLE IF NOT EXISTS faculty(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
mobile TEXT,
password TEXT
)
`)

/* LOCATION TRACKING */

db.run(`
CREATE TABLE IF NOT EXISTS locations(
id INTEGER PRIMARY KEY AUTOINCREMENT,
roll TEXT,
latitude REAL,
longitude REAL,
status TEXT,
time DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)

module.exports=db
