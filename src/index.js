const express = require("express")
const path = require("path")
const http = require("http")
const socketio = require("socket.io")
const Filter= require('bad-words')
const router = require("../src/router/router")
// const { createAdapter } = require("@socket.io/mongo-adapter");
const mongodb = require("mongodb");



const MongoClient = new mongodb.MongoClient("mongodb+srv://arti:arti1234@cluster0.yj4az.mongodb.net/?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
});
const app = express()
const server = http.createServer(app)
const io=socketio(server)
app.use("/",router)
// let msg
const publicDirectoryPath = path.join(__dirname,"../public")
app.use(express.static(publicDirectoryPath))

const DB = "book";
const COLLECTION = "book";

const url ="mongodb+srv://arti:arti1234@cluster0.yj4az.mongodb.net/?retryWrites=true&w=majority"

io.on('connection',(socket)=>{
    console.log("New WebSocket Connection")
    // socket.emit("countUpdated",count)
    // socket.on('inc',()=>{
    //     count++
    //     socket.emit("countUpdated",count)
    //     // io.emit("countUpdated",count)// i add io bcoz socket give response for paarticular client 
    // })
    socket.emit("msg","Welcome!")
    socket.broadcast.emit("msg","A new user joined!!")
    // socket
    socket.on("sendMsg",(msg,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback("profanity is not allowed!!")
        }
        io.emit('msg',msg)
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('msg',"A user has left!")
    })
    socket.on('sendLocation',(coords,callback)=>{
        io.emit('msg',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})

app.post("/create",function (req,res){
    // await MongoClient.connect()
    mongodb.MongoClient.connect(url,function(db){
   
    db.COLLECTION.insertOne(req.body)
    })
    res.send("data recevied:\n"+ JSON.stringify(req.body))
})
const PORT =process.env.PORT || 3000
server.listen(PORT,()=>{
    console.log(`server is running on  http://localhost:${PORT}`)
})