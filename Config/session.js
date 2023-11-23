const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

let store = new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    collection: "sessions",
  });

const session = ({app, io}) => {

  const sessionInstance = expressSession(
    process.env.ENV === "prod"
      ? {
          secret: process.env.sessions_key,
          resave: false,
          store: store,
          saveUninitialized: true,
          cookie: {
            maxAge: 1000 * 60 * 60 * 48,
            sameSite: "none",
            secure: true,
          },
        }
      : {
          name: "codre",
          secret: process.env.sessions_key,
          resave: false,
          saveUninitialized: false,
          store: store,
          cookie: {
            secure: false,
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 15,
          },
        }
  );

  app.use(sessionInstance);
  io.use((socket, next) => sessionInstance(socket.request, {}, next));
  return sessionInstance;
};

module.exports = session;
