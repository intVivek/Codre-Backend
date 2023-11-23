const Document = require("../Model/Document");

const getPopularDocuments = async () =>
  await Document.find({ popular: true }).populate("user");

const getDocByRoomId = async (roomId) => await Document.findById(roomId);

const updateDocumentData = async (roomId, newData) =>
  await Document.findByIdAndUpdate(roomId, { data: newData });

module.exports = {
  getPopularDocuments,
  getDocByRoomId,
  updateDocumentData,
};
