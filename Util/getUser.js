/**
 * Function to extract the user information from a socket's session passport data.
 * @param {Object} socket - The socket object.
 * @returns {Object|null} - The extracted user object or null if not found.
 */
const getUser = (socket) => socket?.request?.session?.passport?.user;

// Export the getUser function
module.exports = getUser;
