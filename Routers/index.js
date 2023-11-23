const createRoom = require('./createRoom');
const checkRoom = require('./checkRoom');
const fetchHome = require('./fetchHome');
const logout = require('./logout');
const checkAuthentication = require('./checkAuthentication');
const googleAuthenticate = require('./googleAuthenticate');
const googleAuthenticateCallback = require('./googleAuthenticateCallback');

module.exports = {createRoom, checkRoom, fetchHome, checkAuthentication, logout, googleAuthenticate, googleAuthenticateCallback};
