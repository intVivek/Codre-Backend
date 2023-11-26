const passport = require("passport");

// Initiates the Google authentication process with specified scopes.
const handleGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Handles the callback after Google has authenticated the user.
const handleGoogleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (error, user, authInfo) => {
    // If user is not authenticated, redirect to the error page.
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/error`);

    // Log in the authenticated user and redirect to the home page.
    req.logIn(user, (err) => {
      res.redirect(`${process.env.CLIENT_URL}/home`);
    });
  })(req, res, next);
};

// Handles requests to check if a user is authenticated.
const handleIsAuthenticated = async (req, res) => {
  // Responds with JSON indicating that the user is authorized.
  res.json({ status: 1, message: "Authorized" });
};

// Handles the logout process for the authenticated user.
const handleLogout = (req, res) => {
  // Logs out the user and responds with a success message.
  req.logOut();
  res.status(200).json({ status: 1, message: "Successfully Logged out" });
};

module.exports = {
  handleLogout,
  handleIsAuthenticated,
  handleGoogleAuth,
  handleGoogleAuthCallback,
};
