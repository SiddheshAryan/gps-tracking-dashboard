let currentRoll=null
let map
let marker


function hideAll(){

document.querySelectorAll("div").forEach(d=>{
if(d.id!=="home") d.classList.add("hidden")
})

}


function showStudentRegister(){
hideAll()
document.getElementById("studentRegister").classList.remove("hidden")
}

function showStudentLogin(){
hideAll()
document.getElementById("studentLogin").classList.remove("hidden")
}

function showParentRegister(){
hideAll()
document.getElementById("parentRegister").classList.remove("hidden")
}

function showTeacherRegister(){
hideAll()
document.getElementById("teacherRegister").classList.remove("hidden")
}

function showParentTrack(){
hideAll()
document.getElementById("parentTrack").classList.remove("hidden")
}

function showTeacherTrack(){
hideAll()
document.getElementById("teacherTrack").classList.remove("hidden")
}


// REGISTER STUDENT

function registerStudent(){

fetch("/api/student/register",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

name:sname.value,

roll:sroll.value,

faculty:sfaculty.value,

age:sage.value,

gender:sgender.value,

password:spass.value

})

})

.then(res=>res.json())

.then(d=>{

alert("Registered successfully")

location.reload()

})

}


// LOGIN STUDENT

function loginStudent(){

fetch("/api/student/login",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

roll:lroll.value,

password:lpass.value

})

})

.then(res=>res.json())

.then(d=>{

alert(d.message)

currentRoll=lroll.value

})

}


// START

function start(){

fetch("/api/student/start",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({roll:currentRoll})

})

document.getElementById("status").innerText="Status: START"

navigator.geolocation.watchPosition(pos=>{

fetch("/api/location/update",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

roll:currentRoll,

lat:pos.coords.latitude,

lng:pos.coords.longitude

})

})

})

}


// STOP

function stop(){

fetch("/api/student/stop",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({roll:currentRoll})

})

document.getElementById("status").innerText="Status: STOP"

}


// PARENT TRACK

function track(){

let roll=trackRoll.value

map=L.map("map").setView([20,78],5)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

setInterval(()=>{

fetch("/api/location/"+roll)

.then(r=>r.json())

.then(d=>{

if(!d.lat) return

if(marker){
marker.setLatLng([d.lat,d.lng])
}else{
marker=L.marker([d.lat,d.lng]).addTo(map)
map.setView([d.lat,d.lng],15)
}

})

},3000)

}


// TEACHER LOAD STUDENTS

function loadStudents(){

fetch("/api/teacher/students/"+facultySearch.value)

.then(r=>r.json())

.then(list=>{

studentDropdown.innerHTML=""

list.forEach(s=>{

let opt=document.createElement("option")

opt.value=s.roll

opt.text=s.name+" - "+s.roll

studentDropdown.appendChild(opt)

})

})

}


function trackSelected(){

trackRoll={value:studentDropdown.value}

track()

}
