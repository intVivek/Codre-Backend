var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport =require("passport");
const User = require("./Model/Models.js");
const {String2HexCodeColor} = require('string-to-hex-code-color');

function initialize() {
  const string2HexCodeColor = new String2HexCodeColor();

  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
      var user, error;
      var color = string2HexCodeColor.stringToColor(profile.id,0.5);

      try{
        user = await User.findOne({ googleId: profile.id});
        if (!user)
          user = await User.create({ 
          googleId: profile.id,
          name:profile.name,
          emails: profile.emails,
          photos: profile.photos,
          color: color,
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