const {
  createRoom,
  fetchHome,
  checkRoom,
  checkAuthentication,
  logout,
  googleAuthenticate,
  googleAuthenticateCallback,
} = require("../Routers");

const router = ({app}) => {
  app.use(checkAuthentication);
  app.use(createRoom);
  app.use(checkRoom);
  app.use(fetchHome);
  app.use(logout);
  app.use(googleAuthenticate);
  app.use(googleAuthenticateCallback);
};

module.exports = router;
