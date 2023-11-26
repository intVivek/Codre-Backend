const { getDocByRoomId } = require("../Services/documentServices");
const { getRoomId, getUser } = require("../Util");
const { addClientInRoom } = require("./addClientInRoom");
const { handleDataRequests } = require("./handleDataRequests");
const listeners = require("./listeners");

// Function to handle a new connection to the socket.io server.
const onConnection = (io) => async (socket) => {
  // Extracts the room ID and user information from the socket.
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  // Retrieves the document for the room.
  var doc = await getDocByRoomId(roomId);

  // If user, room, or document information is missing, emit a "failed" event and return.
  if (!user || !roomId || !doc) return socket.emit("failed");

  // Adds the client to the room and handles data requests for the new connection.
  addClientInRoom(socket);
  handleDataRequests(socket, io);

  // Initializes event listeners for various socket events.
  const {
    onTextChange,
    onSelectionChange,
    onDisconnecting,
    onSaveChanges,
    onDataRequestFromForeignClient,
  } = listeners(roomId, user, io);

  // Registers event listeners for the socket.
  socket.on("dataRequestFromForeignClient", onDataRequestFromForeignClient);
  socket.on("selection", onSelectionChange);
  socket.on("textChange", onTextChange);
  socket.on("saveChangesOnClientLeft", onSaveChanges);
  socket.on("disconnecting", onDisconnecting);
};

module.exports = onConnection;
