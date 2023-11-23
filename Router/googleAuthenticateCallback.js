const express = require('express');
const router = express.Router();
const { handleGoogleAuthCallback } = require('../Controller/authController');

router.get("/auth/google/callback", handleGoogleAuthCallback);

module.exports = router