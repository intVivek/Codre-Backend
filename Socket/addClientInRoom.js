const { getRoomId, getUser } = require("../Util");
const { addUserToRecentlyJoined } = require("../Services/userServices");
const { createOrAddUserInRoom } = require("../Services/roomServices");

const addClientInRoom = async (socket) => {
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  await createOrAddUserInRoom(roomId, user?._id);

  await addUserToRecentlyJoined(user._id, roomId);

  socket.join(roomId);

  socket.to(roomId).emit("connected", user);
};

module.exports = { addClientInRoom };
