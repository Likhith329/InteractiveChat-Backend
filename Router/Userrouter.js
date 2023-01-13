const express=require('express')
const router=express.Router()

const Usermodule=require('../Modules/Usermodule')
router.put('/renameuser',Usermodule.renameuser)
router.put('/setprofilepic',Usermodule.setprofilepic)

module.exports=router