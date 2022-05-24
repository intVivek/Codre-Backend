const express = require('express');
const router = express.Router();
const Document = require("../Model/Document.js");

router.post('/checkRoom', async (req, res) => {
    const {room} = req.body;
    try {
        if(!room) return res.json({status: 0, message: 'Please enter room ID'});
        const doc = await Document.findOne({_id: room});
        if(!doc) return res.json({status: 0, 'message': 'Room not found'});
        return res.json({status: 1});
    } catch (err) {
        return res.json({status: 0,'message': 'Some error occured'});
    }
});

module.exports = router