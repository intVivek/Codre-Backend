const express = require('express');
const router = express.Router();
const Document = require("../Model/MongoDB.js");

router.post('/home', async (req,res)=>{
    if(!req.isAuthenticated()) return res.json({status: 0, message:"Unauthorized"});
    const createdRooms = await Document.find({"user._id": req.user._id});
    console.log(createdRooms,req.user);
    res.json({status: 1, user: req.user, createdRooms});
    })

module.exports = router