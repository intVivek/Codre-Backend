const express = require('express');
const { isAuthenticated } = require('../Middleware/authentication');
const { handleIsAuthenticated } = require('../Controller/authController');
const router = express.Router();

router.get('/auth', isAuthenticated, handleIsAuthenticated);

module.exports = router