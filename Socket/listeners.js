const { updateDocumentData } = require("../Services/documentServices.js");
const { removeSocketFromUser } = require("../Services/roomServices.js");

module.exports = (roomId, user, io) => {
  function onTextChange(data) {
    this.to(roomId).emit("textChange", data);
  }

  function onSelectionChange(data) {
    if (data) data._id = user._id;
    this.to(roomId).emit("selection", data);
  }

  async function onDataRequestFromForeignClient({ socketId, data }) {
    io.to(socketId).emit("loadDoc", data);
    await updateDocumentData(roomId, data);
  }

  async function onDisconnecting(reason) {
    const socketId = this.id;
    
    await removeSocketFromUser(roomId, user._id, socketId);

    this.to(roomId).emit("exit", user._id);
  }

  async function onSaveChanges(data) {
    await updateDocumentData(roomId, data);
  }

  return {
    onTextChange,
    onSelectionChange,
    onDisconnecting,
    onSaveChanges,
    onDataRequestFromForeignClient,
  };
};
