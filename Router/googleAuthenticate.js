const express = require("express");
const { handleGoogleAuth } = require("../Controller/authController");
const router = express.Router();

router.get("/auth/google", handleGoogleAuth);

module.exports = router;
