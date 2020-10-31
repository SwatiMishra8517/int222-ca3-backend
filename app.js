const express = require("express")
const cors = require("cors")
const path = require('path')
const User = require("./models/user")
require("./config/mongo")
const { users } = require("./mocks/users")
const authHandler = require("./routes/auth")
const SocketHandler = require("./helpers/socketHandler")
const PORT = process.env.PORT || 9008

const http = require("http");
const socketIO = require("socket.io")

const app = express()

app.use(express.static('public'))


app.use(cors())
app.use(express.json())

app.use("/auth",authHandler)

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'));
})


var server = app.listen(PORT,()=>console.log(`Server running at ${PORT}`))

const io = socketIO(server);

new SocketHandler(io)