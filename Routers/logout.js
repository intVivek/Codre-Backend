const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    req.logOut();
      res.status(200).json(
          {status:1,
          message:'Succesfully Logged out'
      });
  });

module.exports = router