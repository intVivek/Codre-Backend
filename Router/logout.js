const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../Middleware/authentication.js');
const { handleLogout } = require('../Controller/authController.js');

router.post('/logout', isAuthenticated, handleLogout);

module.exports = router