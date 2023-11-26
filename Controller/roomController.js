const {
  checkIfRoomExists,
  createRoomWithUser,
} = require("../Services/roomServices");

// Handles the request to check if a room exists.
const handleCheckIfRoomExists = async (req, res) => {
  // Extracts the room information from the request body.
  const { room } = req.body;

  // Calls the checkIfRoomExists service and sends the result as a JSON response.
  const result = await checkIfRoomExists(room);
  res.json(result);
};

// Handles the request to create a room with a user.
const handleCreateRoomWithUser = async (req, res) => {
  // Extracts user, roomName, desc, and invite information from the request body.
  const { user, roomName, desc, invite } = req.body;

  // Calls the createRoomWithUser service and sends the result as a JSON response.
  const result = await createRoomWithUser(user, roomName, desc, invite);
  res.json(result);
};

module.exports = { handleCheckIfRoomExists, handleCreateRoomWithUser };
