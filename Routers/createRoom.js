const express = require('express')
const router = express.Router()
const Document = require("../Model/MongoDB.js");
const { v4: uuid } = require('uuid');

router.post('/createRoom', async (req, res) => {
    console.log(req.body);
    const {user, roomName, desc, invite} = req.body
    var room;
    try {
        room = uuid().slice(10,22);
        await Document.create({_id: room, user, data: '', roomName, desc, invite});
        res.json({status: 1, room});
    } catch (err) {
        res.json({status: 0,err});
    }
});

module.exports = router