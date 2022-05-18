const express = require('express');
const router = express.Router();
const Document = require("../Model/Models.js");
const User = require("../Model/Models.js");

router.post('/home', async (req,res)=>{
    if(!req.isAuthenticated()) return res.json({status: 0, message:"Unauthorized"});
    // const createdRooms = await Document.find({"user": req.user.googleId});
    const createdRooms = await Document.find({"googleId": req.user.googleId}).populate('created');
    console.log(createdRooms,req.user);
    res.json({status: 1, user: req.user, createdRooms});
    })

module.exports = router