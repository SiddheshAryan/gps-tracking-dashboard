const express = require("express")
const http = require("http")
const socketIO = require("socket.io")
const bodyParser = require("body-parser")

const db = require("./database")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(bodyParser.json())

/* SERVE FRONTEND FILES */

app.use(express.static("client"))

/* =============================== */
/* STUDENT REGISTRATION */
/* =============================== */

app.post("/registerStudent",(req,res)=>{

const {name,roll,gender,father,mother,parentPhone} = req.body

db.run(
"INSERT INTO students(name,roll,gender,father,mother,parentPhone) VALUES(?,?,?,?,?,?)",
[name,roll,gender,father,mother,parentPhone],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"student saved"})
}
)

})

/* SET STUDENT PASSWORD */

app.post("/setStudentPassword",(req,res)=>{

const {roll,password} = req.body

db.run(
"UPDATE students SET password=? WHERE roll=?",
[password,roll],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"password set"})
}
)

})

/* =============================== */
/* PARENT REGISTRATION */
/* =============================== */

app.post("/registerParent",(req,res)=>{

const {studentRoll,name} = req.body

db.run(
"INSERT INTO parents(name,studentRoll) VALUES(?,?)",
[name,studentRoll],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"parent saved"})
}
)

})

/* SET PARENT PASSWORD */

app.post("/setParentPassword",(req,res)=>{

const {studentRoll,password} = req.body

db.run(
"UPDATE parents SET password=? WHERE studentRoll=?",
[password,studentRoll],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"password set"})
}
)

})

/* =============================== */
/* FACULTY REGISTRATION */
/* =============================== */

app.post("/registerFaculty",(req,res)=>{

const {name,mobile} = req.body

db.run(
"INSERT INTO faculty(name,mobile) VALUES(?,?)",
[name,mobile],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"faculty saved"})
}
)

})

/* SET FACULTY PASSWORD */

app.post("/setFacultyPassword",(req,res)=>{

const {name,password} = req.body

db.run(
"UPDATE faculty SET password=? WHERE name=?",
[password,name],
(err)=>{
if(err){
console.log(err)
return res.json({status:"error"})
}

res.json({status:"password set"})
}
)

})

/* =============================== */
/* LOGIN SYSTEM */
/* =============================== */

app.post("/login",(req,res)=>{

const {role,id,password} = req.body

/* STUDENT LOGIN */

if(role==="student"){

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

res.json({role:"none"})

})

}

/* PARENT LOGIN */

else if(role==="parent"){

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

res.json({role:"none"})

})

}

/* FACULTY LOGIN */

else if(role==="faculty"){

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

}

})

/* =============================== */
/* GPS LOCATION TRACKING */
/* =============================== */

io.on("connection",(socket)=>{

console.log("Device connected")

socket.on("locationUpdate",(data)=>{

const {roll,lat,lng,status} = data

db.run(
"INSERT INTO locations(roll,latitude,longitude,status) VALUES(?,?,?,?)",
[roll,lat,lng,status]
)

io.emit("locationBroadcast",data)

})

})

/* =============================== */
/* VIEW DATABASE RECORDS */
/* =============================== */

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

app.get("/locations",(req,res)=>{

db.all("SELECT * FROM locations",(err,rows)=>{
res.json(rows)
})

})

/* =============================== */

const PORT = process.env.PORT || 10000

server.listen(PORT,()=>{

console.log("Safety Tracker Server Running on port "+PORT)

})
