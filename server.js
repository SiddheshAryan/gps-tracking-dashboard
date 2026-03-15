const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const bodyParser = require("body-parser")

const db = require("./database")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(bodyParser.json())

/* SERVE FRONTEND */

app.use(express.static("client"))

/* ---------------------- */
/* STUDENT REGISTRATION */
/* ---------------------- */

app.post("/registerStudent",(req,res)=>{

const {name,roll,gender,father,mother,parentPhone} = req.body

db.run(
"INSERT INTO students(name,roll,gender,father,mother,parentPhone) VALUES(?,?,?,?,?,?)",
[name,roll,gender,father,mother,parentPhone]
)

res.json({message:"student saved"})

})

app.post("/setStudentPassword",(req,res)=>{

const {roll,password} = req.body

db.run(
"UPDATE students SET password=? WHERE roll=?",
[password,roll]
)

res.json({message:"password set"})

})

/* ---------------------- */
/* PARENT REGISTRATION */
/* ---------------------- */

app.post("/registerParent",(req,res)=>{

const {studentRoll,name} = req.body

db.run(
"INSERT INTO parents(name,studentRoll) VALUES(?,?)",
[name,studentRoll]
)

res.json({message:"parent saved"})

})

app.post("/setParentPassword",(req,res)=>{

const {studentRoll,password} = req.body

db.run(
"UPDATE parents SET password=? WHERE studentRoll=?",
[password,studentRoll]
)

res.json({message:"parent password set"})

})

/* ---------------------- */
/* FACULTY REGISTRATION */
/* ---------------------- */

app.post("/registerFaculty",(req,res)=>{

const {name,mobile} = req.body

db.run(
"INSERT INTO faculty(name,mobile) VALUES(?,?)",
[name,mobile]
)

res.json({message:"faculty saved"})

})

app.post("/setFacultyPassword",(req,res)=>{

const {name,password} = req.body

db.run(
"UPDATE faculty SET password=? WHERE name=?",
[password,name]
)

res.json({message:"faculty password set"})

})

/* ---------------------- */
/* LOGIN */
/* ---------------------- */

app.post("/login",(req,res)=>{

const {id,password} = req.body

db.get(
"SELECT * FROM students WHERE roll=? AND password=?",
[id,password],
(err,row)=>{

if(row){

return res.json({
role:"student",
name:row.name,
roll:row.roll
})

}

db.get(
"SELECT * FROM parents WHERE studentRoll=? AND password=?",
[id,password],
(err,row)=>{

if(row){

return res.json({
role:"parent",
name:row.name,
roll:row.studentRoll
})

}

db.get(
"SELECT * FROM faculty WHERE name=? AND password=?",
[id,password],
(err,row)=>{

if(row){

return res.json({
role:"faculty",
name:row.name
})

}

res.json({role:"none"})

})

})

})

})

/* ---------------------- */
/* SOCKET GPS TRACKING */
/* ---------------------- */

io.on("connection",(socket)=>{

socket.on("locationUpdate",(data)=>{

const {roll,lat,lng,status} = data

db.run(
"INSERT INTO locations(roll,latitude,longitude,status) VALUES(?,?,?,?)",
[roll,lat,lng,status]
)

io.emit("locationBroadcast",data)

})

})

/* ---------------------- */
/* VIEW DATABASE DATA */
/* ---------------------- */

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

/* ---------------------- */

const PORT = process.env.PORT || 10000

server.listen(PORT,()=>{

console.log("Safety Tracker Server Running on port "+PORT)

})
