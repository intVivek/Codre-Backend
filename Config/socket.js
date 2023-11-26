const Room = require("../Model/Room");
const { resetAllRooms } = require("../Services/roomServices");
const { onConnection } = require("../Socket");

const socket = async ({ io }) => {
  try {
    await resetAllRooms();
    io.on("connection", onConnection(io));
  } catch (e) {
    console.log(e);
  }
};

module.exports = socket;
