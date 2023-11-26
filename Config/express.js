const express = require('express');

const initialize = ({ app }) => {
  // Middleware to parse URL-encoded and JSON request bodies
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // CORS middleware to handle cross-origin requests
  app.use((req, res, next) => {
    // Allow requests from the specified client URL
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
    // Allow specific headers in the request
    res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");
    // Allow credentials to be included in the request
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  // Trust the first proxy (if any)
  app.set("trust proxy", 1);
};

module.exports = initialize;