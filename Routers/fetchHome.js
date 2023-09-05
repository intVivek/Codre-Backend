const express = require('express');
const router = express.Router();
const Document = require("../Model/Document.js");
const User = require("../Model/User.js");
const { isAuthorized } = require('../auth.js');

router.post('/home', isAuthorized, async (req,res)=>{
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
    res.json({status: 1, 'home': data});
});

module.exports = router