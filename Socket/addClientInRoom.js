const { getRoomId, getUser } = require("../Util");
const { assignSocketIdAndrecentlyJoinedToUser } = require("../Services/userServices");
const { createOrAddUserInRoom } = require("../Services/roomServices");

// Function to add a client to a room.
const addClientInRoom = async (socket) => {
  // Extracts the room ID and user from the socket.
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  // Creates or adds the user to the room
  await createOrAddUserInRoom(roomId, user?._id, socket.id);

  // Assigns the socket ID to the user.
  await assignSocketIdAndrecentlyJoinedToUser(user._id, roomId, socket.id);

  // Joins the socket to the specified room.
  socket.join(roomId);

  // Emits a "connected" event to all clients in the room with the user information.
  socket.to(roomId).emit("connected", user);
};

module.exports = { addClientInRoom };
