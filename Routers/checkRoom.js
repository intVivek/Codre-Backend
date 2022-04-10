const express = require('express')
const router = express.Router()
const Document = require("../Model/MongoDB.js");

router.post('/room', async (req, res) => {
    const {room} = req.body
    try {
        var data = await Document.findById(room);
        if(data){
            res.json({status: 1});
        }
        else{
            res.json({status: 0});
        }
    } catch (err) {
        res.json({status: 0,err});
    }
});

module.exports = router