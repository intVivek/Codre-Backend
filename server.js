const expressJS = require("express");
const http = require("http");
const { socketIO } = require("./Socket");

const {
  passport,
  mongoose,
  express,
  session,
  router,
  socket,
  appConfig,
} = require("./Config");

const initializeServer = () => {
  const app = expressJS();
  const server = http.createServer(app);
  const io = socketIO(server);
  
  const appInstance = { app, server, io };

  appConfig([mongoose, express, session, passport, router, socket]).call(
    appInstance
  );

  return appInstance;
};

module.exports = { initializeServer };
