const express = require("express")
const path = require("path")
const http = require("http")
const socketIO = require("socket.io")

const db = require("./database")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const PORT = process.env.PORT || 10000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,"client")))

/* HOME */

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"client","index.html"))
})

/* STUDENT REGISTRATION */

app.post("/registerStudent",(req,res)=>{

const {name,roll,gender,father,mother,parentPhone} = req.body

db.run(`
INSERT INTO students(name,roll,gender,father,mother,parentPhone)
VALUES(?,?,?,?,?,?)
`,[name,roll,gender,father,mother,parentPhone],function(err){

if(err){
return res.send("Registration Failed")
}

res.send("Student Registered")

})

})

/* SET STUDENT PASSWORD */

app.post("/setStudentPassword",(req,res)=>{

const {roll,password} = req.body

db.run(`
UPDATE students
SET password = ?
WHERE roll = ?
`,[password,roll],function(err){

if(err){
return res.send("Password Error")
}

res.send("Password Set Successfully")

})

})

/* PARENT REGISTRATION */

app.post("/registerParent",(req,res)=>{

const {name,studentRoll} = req.body

db.run(`
INSERT INTO parents(name,studentRoll)
VALUES(?,?)
`,[name,studentRoll],function(err){

if(err){
return res.send("Parent Registration Failed")
}

res.send("Parent Registered")

})

})

/* SET PARENT PASSWORD */

app.post("/setParentPassword",(req,res)=>{

const {studentRoll,password} = req.body

db.run(`
UPDATE parents
SET password = ?
WHERE studentRoll = ?
`,[password,studentRoll],function(err){

if(err){
return res.send("Password Error")
}

res.send("Password Set")

})

})

/* FACULTY REGISTRATION */

app.post("/registerFaculty",(req,res)=>{

const {name,mobile} = req.body

db.run(`
INSERT INTO faculty(name,mobile)
VALUES(?,?)
`,[name,mobile],function(err){

if(err){
return res.send("Faculty Registration Failed")
}

res.send("Faculty Registered")

})

})

/* SET FACULTY PASSWORD */

app.post("/setFacultyPassword",(req,res)=>{

const {name,password} = req.body

db.run(`
UPDATE faculty
SET password = ?
WHERE name = ?
`,[password,name],function(err){

if(err){
return res.send("Password Error")
}

res.send("Password Set")

})

})

/* LOGIN */

app.post("/login",(req,res)=>{

const {id,password} = req.body

db.get("SELECT * FROM students WHERE roll=? AND password=?",[id,password],(err,row)=>{

if(row){
return res.json({role:"student",name:row.name,roll:row.roll})
}

db.get("SELECT * FROM parents WHERE studentRoll=? AND password=?",[id,password],(err,row)=>{

if(row){
return res.json({role:"parent",name:row.name,roll:row.studentRoll})
}

db.get("SELECT * FROM faculty WHERE name=? AND password=?",[id,password],(err,row)=>{

if(row){
return res.json({role:"faculty",name:row.name})
}

res.json({role:null})

})

})

})

})

/* VIEW DATABASE */

app.get("/students",(req,res)=>{
db.all("SELECT * FROM students",(err,rows)=>{
res.json(rows)
})
})

app.get("/parents",(req,res)=>{
db.all("SELECT * FROM parents",(err,rows)=>{
res.json(rows)
})
})

app.get("/faculty",(req,res)=>{
db.all("SELECT * FROM faculty",(err,rows)=>{
res.json(rows)
})
})

/* GPS SOCKET */

io.on("connection",(socket)=>{

socket.on("locationUpdate",(data)=>{

const {roll,lat,lng,status} = data

const time = new Date().toISOString()

db.run(`
INSERT INTO tracking(roll,latitude,longitude,time,status)
VALUES(?,?,?,?,?)
`,[roll,lat,lng,time,status])

io.emit("locationBroadcast",data)

})

})

server.listen(PORT,()=>{
console.log("Server running on",PORT)
})

