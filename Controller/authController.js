const passport = require("passport");

const handleGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const handleGoogleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (error, user, authInfo) => {
    if (!user) return res.redirect(`${process.env.CLIENT_URL}/error`);
    req.logIn(user, (err) => {
      res.redirect(`${process.env.CLIENT_URL}/home`);
    });
  })(req, res, next);
};

const handleIsAuthenticated = async (req, res) => {
  res.json({ status: 1, message: "Authorized" });
};

const handleLogout = (req, res) => {
  req.logOut();
  res.status(200).json({ status: 1, message: "Succesfully Logged out" });
};

module.exports = {
  handleLogout,
  handleIsAuthenticated,
  handleGoogleAuth,
  handleGoogleAuthCallback,
};
