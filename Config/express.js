const e = require('express');

 const express = ({app}) => {
  app.use(e.urlencoded({ extended: false }));
  app.use(e.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.set("trust proxy", 1);
};

module.exports = express;