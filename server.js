const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("public"))

const PORT = process.env.PORT || 3000

let students = []
let parents = []
let teachers = []
let locations = {}


// STUDENT REGISTER
app.post("/api/student/register",(req,res)=>{

let student=req.body
student.status="STOP"

students.push(student)

res.json({message:"Student registered"})

})


// STUDENT LOGIN
app.post("/api/student/login",(req,res)=>{

let {roll,password}=req.body

let student = students.find(s=>s.roll===roll)

if(!student){
return res.json({message:"Student not found"})
}

if(student.password!==password){
return res.json({message:"Wrong password"})
}

res.json({
message:"Login successful",
faculty:student.faculty
})

})


// START TRACKING
app.post("/api/student/start",(req,res)=>{

let {roll}=req.body

let student=students.find(s=>s.roll===roll)

if(student){
student.status="START"
}

res.json({message:"Tracking started"})

})


// STOP TRACKING
app.post("/api/student/stop",(req,res)=>{

let {roll}=req.body

let student=students.find(s=>s.roll===roll)

if(student){
student.status="STOP"
}

res.json({message:"Tracking stopped"})

})


// UPDATE LOCATION
app.post("/api/location/update",(req,res)=>{

let {roll,lat,lng}=req.body

locations[roll]={lat,lng,time:new Date()}

res.json({message:"Location updated"})

})


// GET LOCATION
app.get("/api/location/:roll",(req,res)=>{

let roll=req.params.roll

let location=locations[roll]

if(!location){
return res.json({message:"Location not available"})
}

res.json(location)

})


// PARENT REGISTER
app.post("/api/parent/register",(req,res)=>{

parents.push(req.body)

res.json({message:"Parent registered"})

})


// TEACHER REGISTER
app.post("/api/teacher/register",(req,res)=>{

teachers.push(req.body)

res.json({message:"Teacher registered"})

})


// GET STUDENTS BY FACULTY
app.get("/api/teacher/students/:faculty",(req,res)=>{

let faculty=req.params.faculty

let list=students.filter(s=>s.faculty===faculty)

res.json(list)

})


app.listen(PORT,()=>{

console.log("Server running on port "+PORT)

})
