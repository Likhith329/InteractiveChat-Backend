const jwt=require('jsonwebtoken')
const usermodel=require('../Models/UserModel')

module.exports.authenticate=async(req,res,next)=>{
    if(!req.headers['access-token']) return res.status(400).send({msg:"token not found"})
    try {
        const user=jwt.verify(req.headers['access-token'],process.env.Private_key)

        req.body.user=await usermodel.findOne({_id:user.id},{_id:1,name:1,email:1,profilepic:1})
        
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send({msg:"Unauthorized"})
    }
}