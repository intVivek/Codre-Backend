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

const assignSocketIdAndrecentlyJoinedToUser = async (userId, roomId, socketId) => {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { recentlyJoined: roomId, sockets: socketId }, }
    );
  };

  const getUserByid = async (userId) => await User.findById(userId);


module.exports = {
  getUserByid,
  getPopulatedUser,
  assignSocketIdAndrecentlyJoinedToUser,
};