const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

// Create a MongoStore instance for storing sessions in MongoDB
let store = new MongoStore({
  mongoUrl: process.env.MONGODB_URI,
  collection: "sessions",
});

// Sets up session handling for the Express app and Socket.IO
const session = ({ app, io }) => {
  // Configure session based on the environment
  const sessionInstance = expressSession(
    process.env.ENV === "prod"
      ? {
          secret: process.env.sessions_key,   // Secret used to sign the session ID cookie
          resave: false,                       // Do not save the session for every request
          store: store,                        // Use the MongoStore for session storage
          saveUninitialized: true,             // Save uninitialized sessions
          cookie: {
            maxAge: 1000 * 60 * 60 * 48,      // 48 hours expiration time for the session cookie
            sameSite: "none",                 // Allow cross-site requests
            secure: true,                     // Only send cookies over HTTPS
          },
        }
      : {
          name: "codre",                      // Name of the session ID cookie
          secret: process.env.sessions_key,   // Secret used to sign the session ID cookie
          resave: false,                       // Do not save the session for every request
          saveUninitialized: false,            // Do not save uninitialized sessions
          store: store,                        // Use the MongoStore for session storage
          cookie: {
            secure: false,                    // Allow cookies over HTTP
            httpOnly: true,                   // Disallow client-side access to cookies
            maxAge: 1000 * 3600 * 24 * 15,    // 15 days expiration time for the session cookie
          },
        }
  );

  // Use the session middleware in the Express app
  app.use(sessionInstance);

  // Use the session middleware in Socket.IO
  io.use((socket, next) => sessionInstance(socket.request, {}, next));

  // Return the session instance for further use if needed
  return sessionInstance;
};

module.exports = session;
