const Document = require("../Model/Document");

/**
 * Gets popular documents.
 *
 * @return {Promise<Array>} - A promise that resolves to an array of popular documents with user population.
 */
const getPopularDocuments = async () => {
  try {
    // Find documents with popular flag set to true and populate user field
    return await Document.find({ popular: true }).populate("user");
  } catch (error) {
    // Handle errors
    console.error("Error in getPopularDocuments:", error);
    return [];
  }
};

/**
 * Gets a document by room ID.
 *
 * @param {string} roomId - The ID of the room associated with the document.
 * @return {Promise<object|null>} - A promise that resolves to the document or null if not found.
 */
const getDocByRoomId = async (roomId) => {
  try {
    // Find document by ID
    return await Document.findById(roomId);
  } catch (error) {
    // Handle errors
    console.error("Error in getDocByRoomId:", error);
    return null;
  }
};

/**
 * Updates document data.
 *
 * @param {string} roomId - The ID of the room associated with the document.
 * @param {any} newData - The new data to update in the document.
 * @return {Promise<object|null>} - A promise that resolves to the updated document or null if not found.
 */
const updateDocumentData = async (roomId, newData) => {
  try {
    // Update document data by ID
    return await Document.findByIdAndUpdate(roomId, { data: newData });
  } catch (error) {
    // Handle errors
    console.error("Error in updateDocumentData:", error);
    return null;
  }
};

module.exports = {
  getPopularDocuments,
  getDocByRoomId,
  updateDocumentData,
};
