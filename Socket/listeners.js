const Document = require("../Model/Document.js");
const Rooms = require("../Model/Room.js");

module.exports = (roomId, user, io) => {
  function onTextChange(data) {
    this.to(roomId).emit("textChange", data);
  }

  function onSelectionChange(data) {
    if (data) data._id = user._id;
    this.to(roomId).emit("selection", data);
  }

  async function onDataRequestFromForeignClient({ socketId, data }){
    this.emit("loadDoc", data);
    io.to(socketId).emit("loadDoc", data);
    await Document.findByIdAndUpdate(roomId, { data });
  }

  async function onDisconnecting(reason) {
    const users = (await Rooms.findById(roomId))?.users || [];
    await Rooms.findByIdAndUpdate(roomId, {
      users: users?.filter((u) => u != user._id),
    });
    this.to(roomId).emit("exit", user._id);
  }

  async function onSaveChanges(data){
    await Document.findByIdAndUpdate(roomId, { data });
  }

  return {
    onTextChange,
    onSelectionChange,
    onDisconnecting,
    onSaveChanges,
    onDataRequestFromForeignClient,
  };
};
