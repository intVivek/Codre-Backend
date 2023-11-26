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
        path: "users.user",
      })
    )?.users || []
  );
};

const geRoomById = async (roomId) => await Room.findById(roomId);

const createOrAddUserInRoom = async (roomId, userId, socketId) => {
  const room = await geRoomById(roomId);
  const usersInRoom = room?.users || [];

  if (!room) {
    const newRoom = new Room({
      _id: roomId,
      users: [{ user: userId, socketIds: [socketId] }],
    });
    return newRoom.save();
  }

  if (!usersInRoom.map((u) => u.user).includes(userId)) {
    return Room.findOneAndUpdate(
      { user: roomId },
      { $push: { users: { user: userId, socketIds: [socketId] } } }
    );
  }

  return Room.findOneAndUpdate(
    { user: roomId, "users.user": userId },
    { $push: { "users.$.socketIds": socketId } }
  );
};

async function removeSocketFromUser(roomId, userId, socketId) {
  try {
    let updatedRoom = await Room.findOneAndUpdate(
      { user: roomId, "users.user": userId },
      { $pull: { "users.$.socketIds": socketId } },
      { new: true }
    );

    const user = updatedRoom?.users?.find((u) => u?.user == userId);

    if (user && user.socketIds.length === 0) {
      updatedRoom = await Room.findOneAndUpdate(
        { _id: roomId },
        { $pull: { users: { user: userId } } },
        { new: true }
      );
      if (updatedRoom?.users?.length === 0) {
        await Room.findByIdAndDelete(roomId);
      }
    }
  } catch (error) {
    console.error("Error removing socket from user:", error);
  }
}

const removeUserFromRoom = async (roomId, userId) => {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $pull: { users: { user: userId } } },
      { new: true }
    );
    if (updatedRoom && updatedRoom.users.length === 0) {
      await Room.findByIdAndDelete(roomId);
    }
  } catch (error) {
    return error;
  }
};

const resetAllRooms = async () => await Room.deleteMany();

module.exports = {
  checkIfRoomExists,
  createRoomWithUser,
  getUsersInARoom,
  createOrAddUserInRoom,
  removeUserFromRoom,
  removeSocketFromUser,
  geRoomById,
  resetAllRooms,
};
