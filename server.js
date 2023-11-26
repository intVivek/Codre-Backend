// Import necessary modules and dependencies
const expressJS = require("express");
const { createServer } = require("http");
const { socketIO } = require("./Socket");

// Import configurations and setup
const {
  passport,
  mongoose,
  express,
  session,
  router,
  socket,
  configureApp,
} = require("./Config");

// Function to initialize the server
const initializeServer = () => {
  // Create an Express app
  const app = expressJS();

  // Create an HTTP server using the Express app
  const server = createServer(app);

  // Create a Socket.IO instance using the server
  const io = socketIO(server);

  // Create an object to hold references to app, server, and io
  const appInstance = { app, server, io };

  // Configure the app using the provided modules and setup
  configureApp([mongoose, express, session, passport, router, socket]).call(
    appInstance
  );

  // Return the app, server, and io for further use
  return appInstance;
};

// Export the initializeServer function
module.exports = initializeServer;
