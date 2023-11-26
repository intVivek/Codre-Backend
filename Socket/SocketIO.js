const socket = require("socket.io");

// Function to configure and create a Socket.IO instance
const socketIO = (server) => {
  // Create a Socket.IO instance with CORS configuration
  const io = socket(server, {
    cors: {
      origin: process.env.CLIENT_URL, // Allow connections from the specified origin (your client's URL)
      allowedHeaders: ["*"], // Allow all headers
      credentials: true, // Allow credentials (cookies, authorization headers)
    },
  });

  // Return the configured Socket.IO instance
  return io;
};

// Export the socketIO function
module.exports = socketIO;
