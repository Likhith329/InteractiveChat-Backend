const usermodel=require('../Models/UserModel')

module.exports.renameuser=async(req,res)=>{
    try {
        const resp=await usermodel.findOneAndUpdate({_id:req.body.user._id},{$set:{name:req.body.name}},{new:true})
        let ob={
            _id:resp._id,
            name:resp.name,
            email:resp.email,
            profilepic:resp.profilepic,
        }
        res.send(ob)
    } catch (error) {
        console.log(error)
    }
}

module.exports.setprofilepic=async(req,res)=>{
    try {
        const resp=await usermodel.findOneAndUpdate({_id:req.body.user._id},{$set:{profilepic:req.body.profilepic}},{new:true})
        let ob={
            _id:resp._id,
            name:resp.name,
            email:resp.email,
            profilepic:resp.profilepic,
        }
        res.send(ob)
    } catch (error) {
        console.log(error)
    }
}


