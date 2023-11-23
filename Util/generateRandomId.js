const { v4: uuid } = require('uuid');

const generateRandomId = (start=10, end=22) => uuid().slice(start, end).toUpperCase();

module.exports = generateRandomId;