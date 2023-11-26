const { generateRandomId } = require("../Util");
const Document = require("../Model/Document");
const User = require("../Model/User");
const Room = require("../Model/Room");

/**
 * Checks if a room exists.
 *
 * @param {string} roomId - The ID of the room to check.
 * @return {Promise<object>} - A promise that resolves to an object indicating the status and message.
 */
const checkIfRoomExists = async (roomId) => {
  try {
    // Check if roomId is provided
    if (!roomId) return { status: 0, message: "Please enter room ID" };

    // Find the room with the given ID
    const doc = await Document.findOne({ _id: roomId });

    // If the room does not exist, return an error message
    if (!doc) return { status: 0, message: "Room not found" };

    // Room exists
    return { status: 1 };
  } catch (err) {
    // Handle errors
    return { status: 0, message: "Some error occurred" };
  }
};

/**
 * Creates a room with a user.
 *
 * @param {object} user - The user object.
 * @param {string} roomName - The name of the room.
 * @param {string} desc - The description of the room.
 * @param {string} invite - The invitation details for the room.
 * @return {Promise<object>} - A promise that resolves to an object indicating the status and new room ID.
 */
const createRoomWithUser = async (user, roomName, desc, invite) => {
  try {
    // Generate a new room ID
    const newRoomId = generateRandomId();

    // Create a new document for the room
    await Document.create({
      _id: newRoomId,
      user: user._id,
      data: "",
      roomName,
      desc,
      invite,
      popular: false,
    });

    // Add the new room ID to the user's created rooms
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { created: newRoomId } }
    );

    // Return success with the new room ID
    return { status: 1, newRoomId };
  } catch (err) {
    // Handle errors
    return { status: 0, error: err.message };
  }
};

/**
 * Gets users in a room.
 *
 * @param {string} roomId - The ID of the room.
 * @param {object} config - Configuration options.
 * @param {boolean} config.populateUser - Flag to indicate whether user population is requested.
 * @return {Promise<Array>} - A promise that resolves to an array of users in the room.
 */
const getUsersInARoom = async (roomId, config) => {
  try {
    // Check if user population is requested
    if (!config?.populateUser) return (await Room.findById(roomId))?.users || [];

    // Return users in the room with user population
    return (
      (
        await Room.findById(roomId).populate({
          path: "users.user",
        })
      )?.users || []
    );
  } catch (err) {
    // Handle errors
    console.error("Error getting users in a room:", err);
    return [];
  }
};

/**
 * Gets a room by ID.
 *
 * @param {string} roomId - The ID of the room to retrieve.
 * @return {Promise<object|null>} - A promise that resolves to the room or null if not found.
 */
const geRoomById = async (roomId) => await Room.findById(roomId);

/**
 * Creates or adds a user to a room.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} userId - The ID of the user to add.
 * @param {string} socketId - The socket ID of the user.
 * @return {Promise<object|null>} - A promise that resolves to the updated room or null if an error occurs.
 */
const createOrAddUserInRoom = async (roomId, userId, socketId) => {
  try {
    const room = await geRoomById(roomId);
    const usersInRoom = room?.users || [];

    if (!room) {
      // If the room does not exist, create a new room with the user and socket
      const newRoom = new Room({
        _id: roomId,
        users: [{ user: userId, socketIds: [socketId] }],
      });
      return newRoom.save();
    }

    if (!usersInRoom.map((u) => u.user).includes(userId)) {
      // If the user is not in the room, add the user and socket to the room
      return Room.findOneAndUpdate(
        { _id: roomId },
        { $push: { users: { user: userId, socketIds: [socketId] } } }
      );
    }

    // If the user is already in the room, add the socket to the user
    return Room.findOneAndUpdate(
      { _id: roomId, "users.user": userId },
      { $push: { "users.$.socketIds": socketId } }
    );
  } catch (err) {
    // Handle errors
    console.error("Error creating or adding user in room:", err);
    return null;
  }
};

/**
 * Removes a socket from a user in a room.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} userId - The ID of the user.
 * @param {string} socketId - The socket ID to remove.
 */
async function removeSocketFromUser(roomId, userId, socketId) {
  try {
    // Find and update the room to remove the socket from the user
    let updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, "users.user": userId },
      { $pull: { "users.$.socketIds": socketId } },
      { new: true }
    );

    // Get the user in the room
    const user = updatedRoom?.users?.find((u) => u?.user == userId);

    // If the user exists and has no sockets, remove the user from the room
    if (user && user.socketIds.length === 0) {
      updatedRoom = await Room.findOneAndUpdate(
        { _id: roomId },
        { $pull: { users: { user: userId } } },
        { new: true }
      );

      // If the room has no users, delete the room
      if (updatedRoom?.users?.length === 0) {
        await Room.findByIdAndDelete(roomId);
      }
    }
  } catch (error) {
    // Handle errors
    console.error("Error removing socket from user:", error);
  }
}

/**
 * Removes a user from a room.
 *
 * @param {string} roomId - The ID of the room.
 * @param {string} userId - The ID of the user to remove.
 * @return {Promise<Error|null>} - A promise that resolves to an error or null if successful.
 */
const removeUserFromRoom = async (roomId, userId) => {
  try {
    // Find and update the room to remove the user
    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId },
      { $pull: { users: { user: userId } } },
      { new: true }
    );

    // If the room exists and has no users, delete the room
    if (updatedRoom && updatedRoom.users.length === 0) {
      await Room.findByIdAndDelete(roomId);
    }

    return null; // Success, no error
  } catch (error) {
    // Handle errors
    console.error("Error removing user from room:", error);
    return error;
  }
};

/**
 * Resets all rooms by deleting them.
 *
 * @return {Promise<Error|null>} - A promise that resolves to an error or null if successful.
 */
const resetAllRooms = async () => {
  try {
    // Delete all rooms
    await Room.deleteMany();
    return null; // Success, no error
  } catch (error) {
    // Handle errors
    console.error("Error resetting all rooms:", error);
    return error;
  }
};

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
