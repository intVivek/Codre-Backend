const getRoomId = (socket) => socket?.handshake?.query?.room;

module.exports = getRoomId;