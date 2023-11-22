const Document = require("../Model/Document");
const Rooms = require("../Model/Room");
const getRoomId = require("./Utils/getRoomId");
const getUser = require("./Utils/getUser");

const handleDataRequests = async (socket, io) => {

  const roomId = getRoomId(socket);
  const user = getUser(socket)
  var clients = io.sockets.adapter.rooms.get(roomId) || [];
  const clientsInRoom = Array.from(clients);
  if (clientsInRoom.length > 0) {
    var client = clientsInRoom[Math.floor(Math.random() * clientsInRoom.length)];
    io.to(client).emit("clientRequestedData", socket.id);
  } else {
    const doc = await Document.findById(roomId);
    socket.emit("loadDoc", doc.data);
  }

  socket.emit("personalData", { room: roomId, ...user });

  const users =
    (
      await Rooms.findById(roomId).populate({
        path: "users",
      })
    )?.users || [];

  socket.emit("userdata", users);
};

module.exports = { handleDataRequests };
