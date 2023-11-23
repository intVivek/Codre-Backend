const express = require('express');
const router = express.Router();
const { handleCheckIfRoomExists } = require('../Controller/roomController.js');
const { isAuthenticated } = require('../Middleware/authentication.js');

router.post('/checkRoom', isAuthenticated, handleCheckIfRoomExists);

module.exports = router