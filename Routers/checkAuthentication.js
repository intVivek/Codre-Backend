const express = require('express');
const router = express.Router();

router.get('/auth', async (req, res) => {
    if(!req.isAuthenticated()) return res.json({status: 0, message:"Unauthorized"});
    res.json({status: 1, message:"Authorized"});
});

module.exports = router