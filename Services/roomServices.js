const { generateRandomId } = require("../Util");
const Document = require("../Model/Document");
const User = require("../Model/User");
const Room = require("../Model/Room");

const checkIfRoomExists = async (roomId) => {
  try {
    if (!roomId) return { status: 0, message: "Please enter room ID" };

    const doc = await Document.findOne({ _id: roomId });

    if (!doc) return { status: 0, message: "Room not found" };

    return { status: 1 };
  } catch (err) {
    return { status: 0, message: "Some error occurred" };
  }
};

const createRoomWithUser = async (user, roomName, desc, invite) => {
  try {
    const newRoomId = generateRandomId();

    await Document.create({
      _id: newRoomId,
      user: user._id,
      data: "",
      roomName,
      desc,
      invite,
      popular: false,
    });

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { created: newRoomId } }
    );

    return { status: 1, newRoomId };
  } catch (err) {
    return { status: 0, error: err.message };
  }
};

const getUsersInARoom = async (roomId, config) => {
  if (!config?.populateUser) return (await Room.findById(roomId))?.users || [];
  return (
    (
      await Room.findById(roomId).populate({
        path: "users",
      })
    )?.users || []
  );
};

const geRoomById = async (roomId) => await Room.findById(roomId);

const createOrAddUserInRoom = async (roomId, userId) => {
  const room = await geRoomById(roomId);

  const usersInRoom = room?.users || [];

  if (usersInRoom.includes(userId)) return;

  if (room)
    return Room.findOneAndUpdate(
      { _id: roomId },
      { $push: { users: userId } },
      { new: true }
    );

  const newRoom = new Room({
    _id: roomId,
    users: [userId],
  });
  return newRoom.save();
};

const updateRoomUsers = async (roomId, users) =>
  await Room.findByIdAndUpdate(roomId, { users });

module.exports = {
  checkIfRoomExists,
  createRoomWithUser,
  getUsersInARoom,
  createOrAddUserInRoom,
  updateRoomUsers,
  geRoomById,
};
