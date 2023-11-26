const User = require("../Model/User");
const { String2HexCodeColor } = require("string-to-hex-code-color");

const string2HexCodeColor = new String2HexCodeColor();

/**
 * Retrieves a user by ID and populates the 'created' and 'recentlyJoined' fields.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<object|null>} - A promise that resolves to the populated user or null if not found.
 */
const getPopulatedUser = async (userId) => {
  try {
    return await User.findOne({ _id: userId }).populate([
      {
        path: "created",
        options: { sort: { updatedAt: -1 } }, // Sort the 'created' array by updatedAt in descending order
      },
      {
        path: "recentlyJoined",
        populate: { path: "user" }, // Populate the 'recentlyJoined' array with the 'user' field
        options: { sort: { updatedAt: -1 } }, // Sort the 'recentlyJoined' array by updatedAt in descending order
      },
    ]);
  } catch (error) {
    // Log and handle any errors that occur during the process
    console.error("Error in getPopulatedUser:", error);
    throw error; // Re-throw the error to propagate it up the call stack
  }
};

/**
 * Assigns a socket ID and room ID to a user.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} roomId - The ID of the room to add to 'recentlyJoined'.
 * @param {string} socketId - The socket ID to add to 'sockets'.
 */
const assignSocketIdAndrecentlyJoinedToUser = async (userId, roomId, socketId) => {
  try {
    // Find the user by their ID and update the document by pushing values into arrays
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { recentlyJoined: roomId, sockets: socketId }, }
    );
  } catch (error) {
    // Log and handle any errors that occur during the process
    console.error("Error in assignSocketIdAndrecentlyJoinedToUser:", error);
    throw error; // Re-throw the error to propagate it up the call stack
  }
};

/**
 * Retrieves a user by ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<object|null>} - A promise that resolves to the user or null if not found.
 */
const getUserByid = async (userId) => {
  try {
    // Find and return the user with the given ID
    return await User.findById(userId);
  } catch (error) {
    // Log and handle any errors that occur during the process
    console.error("Error in getUserByid:", error);
    throw error; // Re-throw the error to propagate it up the call stack
  }
};

/**
 * Finds or creates a user based on the provided profile.
 *
 * @param {object} profile - The user profile obtained from an external authentication provider.
 * @returns {Promise<{user: object|null, error: Error|null}>} - A promise resolving to the created or found user, and any potential error.
 */
const findOrCreateUser = async (profile) => {
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ _id: profile.id });

    // If user does not exist, create a new user
    if (!user) {
      const color = string2HexCodeColor.stringToColor(profile.id, 0.5);

      user = await User.create({
        _id: profile.id,
        name: profile.name,
        emails: profile.emails,
        photos: profile.photos,
        color: color,
        provider: profile.provider,
      });
    }

    // Return the user and error status
    return { user, error: null };
  } catch (error) {
    // Return null user and the encountered error
    return { user: null, error };
  }
};


module.exports = {
  getUserByid,
  getPopulatedUser,
  findOrCreateUser,
  assignSocketIdAndrecentlyJoinedToUser,
};