const chatmodel=require('../Models/ChatModel')
const usermodel = require('../Models/UserModel')

module.exports.accesschat=async(req,res)=>{
    const{userId}=req.body
   

    if(!userId){
        return res.status(400).send('UserId param not sent with request')
    }

    let isChat=await chatmodel.find({ 
        isGroup:false,
        $and:[
            {users:{$elemMatch:{$eq:req.body.user._id}}},
            {users:{$elemMatch:{$eq:userId}}} 
        ]
    }).populate("users","-password").populate("latestMessage")

    isChat=await usermodel.populate(isChat,{
        path:'latestMessage.sender',
        select:"name profilepic email"
    })

    if(isChat.length){
        res.send(isChat[0])
    }
    else{
        const chatData={
            chatName:"sender",
            isGroup:false,
            users:[req.body.user._id,userId]
        }
        try {
            const createdchat=await chatmodel.create(chatData )
            const fullchat=await chatmodel.findOne({_id:createdchat._id}).populate("users","-password")
            res.send(fullchat)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports.accessallChats=async(req,res)=>{
    try {
        const resp=await chatmodel.find({users:{$elemMatch:{$eq:req.body.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1})
        .then(async(data)=>{
            data=await usermodel.populate(data,{
                path:'latestMessage.sender',
                select:"name profilepic email"
            })
            res.send(data)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.creategroup=async(req,res)=>{
    const users=req.body.users
    if(users.length<2)return res.status(400).send('A group requires atleast 2 members')

    users.push(req.body.user)

    try {
        const group=await chatmodel.create({
            chatName:req.body.name,
            isGroup:true,
            users:users,
            groupAdmin:req.body.user
        })
        const createdgroup=await chatmodel.find({_id:group._id})
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.send(createdgroup)

    } catch (error) {
        console.log(error)
    }

}


module.exports.renamegroup=async(req,res)=>{
try {
    const resp=await chatmodel.findOneAndUpdate({_id:req.body.chatId},{$set:{chatName:req.body.name}},{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")
    res.send(resp)
} catch (error) {
    console.log(error)
}
}

module.exports.addtogroup=async(req,res)=>{

    try {
        const chat=await chatmodel.findOne({_id:req.body.chatId})
        let users=chat.users
    
        if(users.includes(req.body.newuserId))return res.status(400).send("Member already added!")

        users.push(req.body.newuserId)

        const resp=await chatmodel.findOneAndUpdate({_id:req.body.chatId},{$set:{users:users}},{new:true})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.send(resp)
    } catch (error) {
        console.log(error)
    }
}

module.exports.removefromgroup=async(req,res)=>{

    try {
        const chat=await chatmodel.findOne({_id:req.body.chatId})
        let users=chat.users
    
        if(!users.includes(req.body.userId))return res.status(400).send("Member does'nt exist!")
        if(users.length<=2)return res.status(400).send()
        let index=users.indexOf(req.body.userId)
    
        users.splice(index,1)
      
        const resp=await chatmodel.findOneAndUpdate({_id:req.body.chatId},{$set:{users:users}},{new:true})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        res.send(resp)
    } catch (error) {
        console.log(error)
    }
}