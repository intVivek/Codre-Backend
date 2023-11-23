const passport = require("./passport.js");
const mongoose = require("./mongoose.js");
const express = require("./express.js");
const session = require("./session.js");
const socket = require("./socket.js");
const router = require("./router.js");
const appConfig = require("./configure.js");

module.exports = {
  passport,
  mongoose,
  express,
  session,
  socket,
  router,
  appConfig,
};
