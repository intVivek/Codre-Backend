const express = require('express');
const router = express.Router();
const Document = require("../Model/Document.js");
const User = require("../Model/User.js");

router.post('/home', async (req,res)=>{
    if(!req.isAuthenticated()) return res.json({status: 0, message:"Unauthorized"});
    const data = await Promise.all([User.findOne({"_id": req.user._id}).populate([
        {
            path: 'created',
            options: { sort: { 'updatedAt': -1 } }
        },
        {
            path: 'recentlyJoined',
            populate: {path: 'user'},
            options: { sort: { 'updatedAt': -1 } }
        }
    ]),Document.find({"popular": true}).populate('user')]);
    console.log(data);
    res.json({status: 1, 'home': data});
});

module.exports = router