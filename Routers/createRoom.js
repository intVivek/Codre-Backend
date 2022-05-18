const express = require('express')
const router = express.Router()
const Document = require("../Model/Models.js");
const { v4: uuid } = require('uuid');

router.post('/createRoom', async (req, res) => {
    console.log(req.body);
    const {user, roomName, desc, invite} = req.body
    var room;
    try {
        room = uuid().slice(10,22);
        await Document.create({_id: room, User: user._id, data: '', roomName, desc, invite});
        res.json({status: 1, room});
    } catch (err) {
        res.json({status: 0,err});
    }
});

module.exports = router