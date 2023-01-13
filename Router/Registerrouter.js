const express=require('express')
const router=express.Router()

const Registermodule=require('../Modules/Registermodule')

router.post('/signup',Registermodule.signup)
router.post('/signin',Registermodule.signin)



module.exports=router
