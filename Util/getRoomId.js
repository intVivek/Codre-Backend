/**
 * Function to extract the room ID from a socket's handshake query.
 * @param {Object} socket - The socket object.
 * @returns {string|null} - The extracted room ID or null if not found.
 */
const getRoomId = (socket) => socket?.handshake?.query?.room;

// Export the getRoomId function
module.exports = getRoomId;
