const messagemodel=require('../Models/MessageModel')
const usermodel=require('../Models/UserModel')
const chatmodel=require('../Models/ChatModel')

module.exports.sendmessage=async(req,res)=>{
    try {
        let newmessage=await messagemodel.create({
            content:req.body.content,
            sender:req.body.user._id,
            chat:req.body.chatId
        })
        newmessage=await newmessage.populate("sender","name profilepic")
        newmessage=await newmessage.populate("chat")

        newmessage=await usermodel.populate(newmessage,{
            path:"chat.users",
            select:"name profilepic email"
        })

        await chatmodel.findOneAndUpdate({_id:req.body.chatId},{$set:{latestMessage:newmessage}})
        res.send(newmessage)
    } catch (error) {
        console.log(error)
    }
}

module.exports.getallmessages=async(req,res)=>{
    try {
        const resp=await messagemodel.find({chat:req.params.chatId})
        .populate("sender","name profilepic email")
        .populate("chat")

        res.send(resp)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}