const { getDocByRoomId } = require("../Services/documentServices");
const { getUsersInARoom } = require("../Services/roomServices");
const { getRoomId, getUser, getRandomElement } = require("../Util");

// Function to handle data requests from clients.
const handleDataRequests = async (socket, io) => {
  // Extracts the room ID and user from the socket.
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  // Retrieves the list of clients in the room.
  var clients = io.sockets.adapter.rooms.get(roomId) || [];
  const clientsInRoom = Array.from(clients);

  // If there are other clients in the room, send a "clientRequestedData" event to a randomly selected client.
  if (clientsInRoom.length > 0) {
    var client = getRandomElement(clientsInRoom);
    io.to(client).emit("clientRequestedData", socket.id);
  } else {
    // If there are no other clients, retrieve the document data for the room and send a "loadDoc" event.
    const doc = await getDocByRoomId(roomId);
    socket.emit("loadDoc", doc.data);
  }

  // Send "personalData" event with user information to the current client.
  socket.emit("personalData", { room: roomId, ...user });

  // Retrieve and send user data for all users in the room.
  const users = await getUsersInARoom(roomId, { populateUser: true });
  socket.emit("userdata", users.map((u) => u.user));
};

module.exports = { handleDataRequests };
