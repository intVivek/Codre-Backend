const express = require('express');
const router = express.Router();
const Document = require("../Model/Document.js");
const User = require("../Model/User.js");
const { v4: uuid } = require('uuid');

router.post('/createRoom', async (req, res) => {
    console.log('8',req.body);
    const {user, roomName, desc, invite} = req.body
    var room;
    try {
        room = uuid().slice(10,22).toUpperCase();
        await Document.create({_id: room, user: user._id, data: '', roomName, desc, invite, popular: false});
        await User.findOneAndUpdate({_id: user._id}, { $push: { created: room } });
        res.json({status: 1, room});
    } catch (err) {
        res.json({status: 0,err});
    }
});

module.exports = router