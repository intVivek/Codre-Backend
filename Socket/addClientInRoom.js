const { getRoomId, getUser } = require("../Util");
const { assignSocketIdAndrecentlyJoinedToUser } = require("../Services/userServices");
const { createOrAddUserInRoom } = require("../Services/roomServices");

const addClientInRoom = async (socket) => {
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  await createOrAddUserInRoom(roomId, user?._id, socket.id);

  await assignSocketIdAndrecentlyJoinedToUser(user._id, roomId, socket.id);

  socket.join(roomId);

  socket.to(roomId).emit("connected", user);
};

module.exports = { addClientInRoom };
