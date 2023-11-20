const express = require("express");
const User = require("./Model/User.js");
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const Document = require("./Model/Document.js");
const Rooms = require("./Model/Room.js");
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

io.on("connection", async (socket) => {
  var roomId = socket?.handshake?.query?.room;
  var user = socket?.request?.session?.passport?.user;

  var findRoom = await Document.findById(roomId);
  if (!user || !roomId || !findRoom) {
    return socket.emit("failed");
  }

  const room = await Rooms.findById(roomId);
  const usersInRoom = room?.users || [];
  if (!usersInRoom.some((u) => u == user?._id)) {
    if (room) {
      usersInRoom.push(user._id);
      await Rooms.findOneAndUpdate({ _id: roomId }, { users: usersInRoom });
    } else {
      let users = [];
      users.push(user._id);
      Rooms.create({ _id: roomId, users });
    }
  }

  var clients = io.sockets.adapter.rooms.get(roomId);
  if (clients) {
    const clientsArray = Array.from(clients);
    var client = clientsArray[Math.floor(Math.random() * clientsArray.length)];
    io.to(client).emit("clientRequestedData", socket.id);
  } else {
    const doc = await Document.findById(roomId);
    socket.emit("loadDoc", doc.data);
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { $push: { recentlyJoined: roomId } }
  );
  socket.join(roomId);

  socket.to(roomId).emit("connected", user);

  socket.emit("personalData", { room: roomId, ...user });

  const users =
    (
      await Rooms.findById(roomId).populate({
        path: "users",
      })
    )?.users || [];

  socket.emit("userdata", users);

  socket.on("clientRequestedData", async ({ socketId, data }) => {
    socket.emit("loadDoc", data);
    io.to(socketId).emit("loadDoc", data);
    await Document.findByIdAndUpdate(roomId, { data });
  });

  socket.on("selection", (data) => {
    if (data) data._id = user._id;
    socket.to(roomId).emit("selection", data);
  });

  socket.on("textChange", (data) => {
    socket.to(roomId).emit("textChange", data);
  });

  socket.on("saveChangesOnClientLeft", async (data) => {
    await Document.findByIdAndUpdate(roomId, { data });
  });

  socket.on("disconnecting", async (reason) => {
    const users = (await Rooms.findById(roomId))?.users || [];
    await Rooms.findByIdAndUpdate(roomId, {
      users: users?.filter((u) => u != user._id),
    });
    socket.to(roomId).emit("exit", user._id);
  });
});

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
