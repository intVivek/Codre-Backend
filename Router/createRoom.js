const express = require('express');
const { isAuthenticated } = require('../Middleware/authentication');
const { handleCreateRoomWithUser } = require('../Controller/roomController');
const router = express.Router();

router.post('/createRoom', isAuthenticated, handleCreateRoomWithUser);

module.exports = router