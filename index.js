const mongoose=require('./connect')
const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const Registerrouter=require('./Router/Registerrouter')
const Registermodule=require('./Modules/Registermodule')
const Chatrouter=require('./Router/Chatrouter')
const Messagerouter=require('./Router/Messagerouter')
const Userrouter=require('./Router/Userrouter')

dotenv.config()
const app=express()

mongoose.connectMongoose()
app.use(express.json())
app.use(cors())

const Authmodule=require('./Modules/Authmodule')



app.use('/register',Registerrouter)// router for signup and signin

app.use('/',Authmodule.authenticate)

//the below one is authenticated from the above
app.get('/register/signup',Registermodule.getusers)// retreiving the users after signup

app.use('/chats',Chatrouter)

app.use('/messages',Messagerouter)

app.use('/users',Userrouter)



const server=app.listen(process.env.PORT,console.log('server started'))

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'https://interactive-one-on-one.netlify.app'
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")

    socket.on("setup",(data)=>{
        socket.join(data._id)
        socket.emit('connected')
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User joined room ",room)
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on("new message",(newmessage)=>{
        let chat=newmessage.chat
        
        chat.users.forEach(user => {
            if(user._id!==newmessage.sender._id){
                socket.in(user._id).emit("received message",newmessage)
            }
        });
    })

    socket.off("setup",()=>{
        console.log('user disconnected')
        socket.leave(data._id)
    })
})