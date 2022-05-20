const express = require('express');
const router = express.Router();
const Document = require("../Model/Document.js");

router.post('/checkRoom', async (req, res) => {
    const {room} = req.body;
    console.log('8',room);
    try {
        if(!room) return res.json({status: 0, message: 'Please enter room ID'});
        const doc = await Document.findOne({_id: room});
        console.log('11',room,doc);
        if(!doc) return res.json({status: 0, 'message': 'Room not found'});
        return res.json({status: 1});
    } catch (err) {
        console.log(err);
        return res.json({status: 0,'message': 'Some error occured'});
    }
});

module.exports = router