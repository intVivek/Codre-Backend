const getRoomId = require("./Utils/getRoomId");
const Rooms = require("../Model/Room");
const User = require("../Model/User");
const getUser = require("./Utils/getUser");

const addClientInRoom = async (socket) => {
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  const room = await Rooms.findById(roomId);
  const usersInRoom = room?.users || [];
  if (!usersInRoom.some((u) => u == user?._id)) {
    if (room) {
      usersInRoom.push(user._id);
      await Rooms.findOneAndUpdate({ _id: roomId }, { users: usersInRoom });
    } else {
      let users = [];
      users.push(user._id);
      Rooms.create({ _id: roomId, users });
    }
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { $push: { recentlyJoined: roomId } }
  );
  socket.join(roomId);

  socket.to(roomId).emit("connected", user);
};

module.exports = { addClientInRoom };
