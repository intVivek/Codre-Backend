const { getDocByRoomId } = require("../Services/documentServices");
const { getUsersInARoom } = require("../Services/roomServices");
const {getRoomId, getUser, getRandomElement} = require("../Util");

const handleDataRequests = async (socket, io) => {

  const roomId = getRoomId(socket);
  const user = getUser(socket)
  var clients = io.sockets.adapter.rooms.get(roomId) || [];
  const clientsInRoom = Array.from(clients);
  if (clientsInRoom.length > 0) {
    var client = getRandomElement(clientsInRoom);
    io.to(client).emit("clientRequestedData", socket.id);
  } else {
    const doc = await getDocByRoomId(roomId);
    socket.emit("loadDoc", doc.data);
  }

  socket.emit("personalData", { room: roomId, ...user });

  const users = await getUsersInARoom(roomId, {populateUser: true});

  socket.emit("userdata", users);
};

module.exports = { handleDataRequests };
