const User = require("../Model/User");

const getPopulatedUser = async (userId) => {
  return User.findOne({ _id: userId }).populate([
    {
      path: "created",
      options: { sort: { updatedAt: -1 } },
    },
    {
      path: "recentlyJoined",
      populate: { path: "user" },
      options: { sort: { updatedAt: -1 } },
    },
  ]);
};

const addUserToRecentlyJoined = async (userId, roomId) => {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { recentlyJoined: roomId } }
    );
  };

module.exports = {
  getPopulatedUser,
  addUserToRecentlyJoined,
};