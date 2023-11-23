const socket = require("socket.io");

const socketIO = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      allowedHeaders: ["*"],
      credentials: true,
    },
  });
  return io;
};

module.exports = socketIO;