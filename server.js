const express = require('express');
const cookieParser = require('cookie-parser');
const User = require("./Model/User.js");
const app = express();
const server = require('http').createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const Document = require("./Model/Document.js");
const passport =require("passport");
const createRoom = require('./Routers/createRoom.js');
const fetchHome = require('./Routers/fetchHome.js');
const checkRoom = require('./Routers/checkRoom.js');
const initializePassport = require('./passport');
const expressSession = require("express-session");
const MongoStore = require('connect-mongo');
const io = require('socket.io')(server,{
  cors:
  {
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["*"],
    credentials: true
  }
});

let store = new MongoStore({
  mongoUrl: process.env.MONGODB_URI,
  collection: "sessions"
});

app.use(express.urlencoded({ extended : false }));
app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
	res.setHeader('Access-Control-Allow-Headers', 'content-type,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.set("trust proxy", 1);


// const session = expressSession({
// 	secret: process.env.sessions_key,
// 	resave: false,
// 	store: store,
// 	saveUninitialized: false,
// 	cookie: {
// 		maxAge : 1000 * 60 * 60 * 48,
// 		// sameSite: process.env.ENV==='dev'?'lax':'none',
// 		// secure: process.env.ENV==='dev'?false:true,
//     sameSite: 'none', 
// 		secure: false,
//     httpOnly: true
// 	}
// });

// prod
const session = expressSession({
	secret: process.env.sessions_key,
	resave: false,
	store: store,
	saveUninitialized: true,
	cookie: {
		maxAge : 1000 * 60 * 60 * 48,
		sameSite: process.env.ENV==='dev'?'lax':'none',
		secure: process.env.ENV==='dev'?false:true,
    httpOnly: true
	}
});


//dev
// const session = expressSession({
//   name: 'coder',
//   secret: process.env.sessions_key,
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     maxAge: 1000 * 3600 * 24 * 15
//   }
// });

app.use(session);
io.use((socket, next) => session(socket.request, {}, next));

app.use(passport.initialize())
app.use(passport.session())
initializePassport();

mongoose.connect(process.env.MONGODB_URI,  
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log('DATABASE CONNECTED'))
.catch(err => console.error("Error connecting to mongo", err));

const rooms = new Map();

io.on('connection', async (socket) => {
  var id=socket.id;
  var doc;
  var room = socket?.handshake?.query?.room;
  var user=socket?.request?.session?.passport?.user;

  var findRoom = await Document.findById(room);
  if(!user||!room||!findRoom){
    return socket.emit('failed');
  }

  user['socketId'] = socket.id;
  user['room'] = room;
  if(rooms.has(room)){
    var users = rooms.get(room);
    users[socket.id] = user;
    rooms.set(room,users);
  }
  else{
    var users ={};
    users[socket.id] = user;
    rooms.set(room,users);
  }

  var clients = io.sockets.adapter.rooms.get(room);
  if(clients){
    const clientsArray = Array.from(clients);
    var client = clientsArray[Math.floor(Math.random()*clientsArray.length)];
    io.to(client).emit('clientRequestedData',id);
  }
  else {
    doc = await Document.findById(room);
    socket.emit('loadDoc', doc,Object.values(users));
  }

  const user1 = await User.findOneAndUpdate({_id: user._id}, { $push: { recentlyJoined: room } });
  socket.join(room);

  socket.to(room).emit('connected', user);

  socket.emit('personalData', user);

  socket.emit('userdata', Object.values(rooms.get(room)));

  socket.on('clientRequestedData', (data)=>{
    io.to(data.id).emit('loadDoc', data);
  })

  socket.on('selection', (data) => {
    if(data)data.socketId = socket?.id;
    // data.color=color;
    socket.to(room).emit('selection', data) ;
  }) 

  socket.on('textChange', (data)=>{
    socket.to(room).emit('textChange', data);
  })

  socket.on("clientLeft", async (id,room,data) => {
    var users = rooms.get(room);
    delete users[id];
    rooms.set(room,users);
    socket.to(room).emit("exit", id);
    await Document.findByIdAndUpdate(room, { data })
  });
});

app.use(createRoom);
app.use(checkRoom);
app.use(fetchHome);
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', (req, res, next) => {
	passport.authenticate('google', (error, user, authInfo) => {
		if (!user) res.redirect(`${process.env.CLIENT_URL}/error`);
		req.logIn(user, (err) => {
			res.redirect(`${process.env.CLIENT_URL}/home`);
		});
	})(req, res, next)
});

server.listen(process.env.PORT || 5000,()=>{
  console.log(`Server Started at port ${process.env.PORT}`);
});