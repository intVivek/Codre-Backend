var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport =require("passport");
const User = require("./Model/User.js");

function initialize() {

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      var user, error;
      try{
        user = await User.findOne({ googleId: profile.id});
        if (!user)
          user = await User.create({ 
          googleId: profile.id,
          name:profile.name,
          emails: profile.emails,
          photos: profile.photos,
          provider: profile.provider });
      }
      catch(error){
        error = error;
        console.log(error);
      }
      return cb(error, user);
    }
  ));

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });
}

module.exports = initialize;