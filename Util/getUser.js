const getUser = (socket) => socket?.request?.session?.passport?.user;

module.exports = getUser;