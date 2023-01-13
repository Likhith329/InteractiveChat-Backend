const express=require('express')
const router=express.Router()

const Chatmodule=require('../Modules/Chatmodule')
router.post('/',Chatmodule.accesschat)
router.get('/',Chatmodule.accessallChats)
router.post('/creategroup',Chatmodule.creategroup)
router.put('/renamegroup',Chatmodule.renamegroup)
router.put('/removefromgroup',Chatmodule.removefromgroup)
router.put('/addtogroup',Chatmodule.addtogroup)

module.exports=router