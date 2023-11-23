const express = require('express');
const router = express.Router();
const passport = require("passport");

router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", (error, user, authInfo) => {
      if (!user) res.redirect(`${process.env.CLIENT_URL}/error`);
      req.logIn(user, (err) => {
        res.redirect(`${process.env.CLIENT_URL}/home`);
      });
    })(req, res, next);
  });

module.exports = router