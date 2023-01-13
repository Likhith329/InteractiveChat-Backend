const express=require('express')
const router=express.Router()

const Messagemodule=require('../Modules/Messagemodule')
router.post('/sendmessage',Messagemodule.sendmessage)
router.get('/getallmessages/:chatId',Messagemodule.getallmessages)
module.exports=router