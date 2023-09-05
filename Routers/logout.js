const express = require('express');
const router = express.Router();
const { isAuthorized } = require('../auth.js');

router.post('/logout', isAuthorized, (req, res) => {
    req.logOut();
      res.status(200).json(
          {status:1,
          message:'Succesfully Logged out'
      });
  });

module.exports = router