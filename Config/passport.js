const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { findOrCreateUser } = require("../Services/userServices");

/**
 * Initializes the Google authentication strategy for Passport.
 *
 * @returns {GoogleStrategy} - The configured Google authentication strategy.
 */
const initializeGoogleStrategy = () => {
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // Find or create user based on the Google profile
      const { user, error } = await findOrCreateUser(profile);
      // Callback with error and user
      return cb(error, user);
    }
  );
};

/**
 * Initializes Passport with the configured authentication strategies.
 *
 * @param {object} params - Parameters, including the Express app.
 */
const initializePassport = ({ app }) => {
  // Initialize Passport and session
  app.use(passport.initialize());
  app.use(passport.session());

  // Use Google authentication strategy
  passport.use(initializeGoogleStrategy());

  // Serialize user information for session
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
};

module.exports = initializePassport;