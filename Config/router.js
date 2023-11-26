const {
  createRoom,
  fetchHome,
  checkRoom,
  checkAuthentication,
  logout,
  googleAuthenticate,
  googleAuthenticateCallback,
} = require("../Router");


const router = ({ app }) => {
  // Middleware for checking user authentication
  app.use(checkAuthentication);

  // Middleware for handling room creation
  app.use(createRoom);

  // Middleware for checking room
  app.use(checkRoom);

  // Middleware for handling home page data fetching
  app.use(fetchHome);

  // Middleware for handling user logout
  app.use(logout);

  // Middleware for Google authentication
  app.use(googleAuthenticate);

  // Middleware for handling Google authentication callback
  app.use(googleAuthenticateCallback);
};

module.exports = router;
