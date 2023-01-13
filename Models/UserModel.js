const mongoose=require('mongoose')

const usermodel=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    notifications:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }
    ]
},{
    timestamps:true
})

const User=mongoose.model("User",usermodel)

module.exports=User



