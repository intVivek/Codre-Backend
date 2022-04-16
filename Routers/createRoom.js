const express = require('express')
const router = express.Router()
const Document = require("../Model/MongoDB.js");
const { v4: uuid } = require('uuid');

router.post('/createRoom', async (req, res) => {
    const {userId} = req.body
    var room;
    try {
        room = uuid().slice(9,23);
        await Document.create({ _id: room, userId , data: '' });
        res.json({status: 1, room});
    } catch (err) {
        res.json({status: 0,err});
    }
});

module.exports = router