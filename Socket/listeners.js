const { updateDocumentData } = require("../Services/documentServices.js");
const { removeSocketFromUser } = require("../Services/roomServices.js");

// Event listeners for socket.io events
module.exports = (roomId, user, io) => {
  // Handles "textChange" event
  function onTextChange(data) {
    // Broadcasts the "textChange" event to all clients in the room
    this.to(roomId).emit("textChange", data);
  }

  // Handles "selection" event
  function onSelectionChange(data) {
    // Adds user information to the selection data and broadcasts it to all clients in the room
    if (data) data._id = user._id;
    this.to(roomId).emit("selection", data);
  }

  // Handles "dataRequestFromForeignClient" event
  async function onDataRequestFromForeignClient({ socketId, data }) {
    // Sends the requested document data to the specified client and updates the document in the database
    io.to(socketId).emit("loadDoc", data);
    await updateDocumentData(roomId, data);
  }

  // Handles "disconnecting" event
  async function onDisconnecting(reason) {
    // Retrieves the socket ID
    const socketId = this.id;

    // Removes the socket from the user's information in the room
    await removeSocketFromUser(roomId, user._id, socketId);

    // Broadcasts the "exit" event to all clients in the room
    this.to(roomId).emit("exit", user._id);
  }

  // Handles "saveChanges" event
  async function onSaveChanges(data) {
    // Updates the document data in the database
    await updateDocumentData(roomId, data);
  }

  // Returns the event listeners
  return {
    onTextChange,
    onSelectionChange,
    onDisconnecting,
    onSaveChanges,
    onDataRequestFromForeignClient,
  };
};
