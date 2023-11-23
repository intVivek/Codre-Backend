const { getDocByRoomId } = require("../Services/documentServices");
const { getRoomId, getUser } = require("../Util");
const { addClientInRoom } = require("./addClientInRoom");
const { handleDataRequests } = require("./handleDataRequests");
const listeners = require("./listeners");

const onConnection = (io) => async (socket) => {
  const roomId = getRoomId(socket);
  const user = getUser(socket);

  var doc = await getDocByRoomId(roomId);
  if (!user || !roomId || !doc) return socket.emit("failed");

  addClientInRoom(socket);
  handleDataRequests(socket, io);

  const {
    onTextChange,
    onSelectionChange,
    onDisconnecting,
    onSaveChanges,
    onDataRequestFromForeignClient,
  } = listeners(roomId, user, io);

  socket.on("clientRequestedData", onDataRequestFromForeignClient);
  socket.on("selection", onSelectionChange);
  socket.on("textChange", onTextChange);
  socket.on("saveChangesOnClientLeft", onSaveChanges);
  socket.on("disconnecting", onDisconnecting);
};

module.exports = onConnection;
