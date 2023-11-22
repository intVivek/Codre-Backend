const express = require("express");
const User = require("./Model/User.js");
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const {
  createRoom,
  fetchHome,
  checkRoom,
  checkAuthentication,
  logout,
} = require("./Routers/index.js");

const initializePassport = require("./passport.js");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const { onConnection } = require("./Socket/index.js");
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["*"],
    credentials: true,
  },
});

let store = new MongoStore({
  mongoUrl: process.env.MONGODB_URI,
  collection: "sessions",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.setHeader("Access-Control-Allow-Headers", "content-type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.set("trust proxy", 1);

const session = expressSession(
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

app.use(session);
io.use((socket, next) => session(socket.request, {}, next));

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((err) => console.error("Error connecting to mongo", err));

io.on("connection", onConnection(io));

app.use(checkAuthentication);
app.use(createRoom);
app.use(checkRoom);
app.use(fetchHome);
app.use(logout);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (error, user, authInfo) => {
    if (!user) res.redirect(`${process.env.CLIENT_URL}/error`);
    req.logIn(user, (err) => {
      res.redirect(`${process.env.CLIENT_URL}/home`);
    });
  })(req, res, next);
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Server Started at port ${process.env.PORT}`);
});
