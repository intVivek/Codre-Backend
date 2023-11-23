const { onConnection } = require("../Socket");

const socket = ({io}) => {
  io.on("connection", onConnection(io));
};

module.exports = socket;