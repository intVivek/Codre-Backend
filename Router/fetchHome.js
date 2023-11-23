const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../Middleware/authentication.js');
const { handleHomeData } = require('../Controller/userController.js');

router.post('/home', isAuthenticated, handleHomeData);

module.exports = router