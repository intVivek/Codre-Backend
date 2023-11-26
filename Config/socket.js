const Room = require("../Model/Room");
const { resetAllRooms } = require("../Services/roomServices");
const { onConnection } = require("../Socket");

// Sets up the socket connection
const socket = async ({ io }) => {
  try {
    // Reset all rooms before establishing socket connections
    await resetAllRooms();

    // Handle connection events using the onConnection function
    io.on("connection", onConnection(io));
  } catch (error) {
    console.error("Error in socket initialization:", error);
  }
};

module.exports = socket;
