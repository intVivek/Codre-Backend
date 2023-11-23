const { checkIfRoomExists, createRoomWithUser } = require('../Services/roomServices');

const handleCheckIfRoomExists = async (req, res) => {
  const { room } = req.body;
  const result = await checkIfRoomExists(room);
  res.json(result);
};

const handleCreateRoomWithUser = async (req, res) => {
  const { user, roomName, desc, invite } = req.body;
  const result = await createRoomWithUser(user, roomName, desc, invite);
  res.json(result);
};

module.exports = { handleCheckIfRoomExists, handleCreateRoomWithUser };