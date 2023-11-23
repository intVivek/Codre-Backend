const expressJS = require("express");
const { createServer } = require("http");
const { socketIO } = require("./Socket");

const {
  passport,
  mongoose,
  express,
  session,
  router,
  socket,
  configureApp,
} = require("./Config");

const initializeServer = () => {
  const app = expressJS();
  const server = createServer(app);
  const io = socketIO(server);
  
  const appInstance = { app, server, io };

  configureApp([mongoose, express, session, passport, router, socket]).call(
    appInstance
  );

  return appInstance;
};

module.exports = initializeServer;
