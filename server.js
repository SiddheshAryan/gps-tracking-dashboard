const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const db = require("./database");

const PORT = process.env.PORT || 10000;

/* MIDDLEWARE */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SERVE CLIENT FOLDER */

app.use(express.static(path.join(__dirname, "client")));

/* HOME PAGE */

app.get("/", (req,res)=>{
res.sendFile(path.join(__dirname,"client","index.html"))
})

/* REGISTER USER */

app.post("/register",(req,res)=>{

const {name,roll,password} = req.body

const sql = `
INSERT INTO users (name,roll,password)
VALUES (?,?,?)
`

db.run(sql,[name,roll,password],function(err){

if(err){
console.log(err)
return res.send("Registration failed")
}

res.send("Registration successful")

})

})

/* LOGIN USER */

app.post("/login",(req,res)=>{

const {roll,password} = req.body

const sql = `
SELECT * FROM users
WHERE roll = ? AND password = ?
`

db.get(sql,[roll,password],(err,row)=>{

if(err){
console.log(err)
return res.json({success:false})
}

if(row){
res.json({success:true})
}else{
res.json({success:false})
}

})

})

/* VIEW ALL REGISTERED USERS */

app.get("/users",(req,res)=>{

db.all("SELECT * FROM users",(err,rows)=>{

if(err){
console.log(err)
return res.send("Error fetching users")
}

res.json(rows)

})

})

/* GPS TRACKING SOCKET */

io.on("connection",(socket)=>{

console.log("Device connected")

socket.on("locationUpdate",(data)=>{

const {roll,latitude,longitude} = data
const time = new Date().toISOString()

const sql = `
INSERT INTO tracking (roll,latitude,longitude,time)
VALUES (?,?,?,?)
`

db.run(sql,[roll,latitude,longitude,time])

io.emit("locationBroadcast",data)

})

socket.on("disconnect",()=>{
console.log("Device disconnected")
})

})

/* START SERVER */

server.listen(PORT,()=>{
console.log("✅ Safety Tracker Server Running on port",PORT)
})
