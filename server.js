const express = require('express');
const cookieParser = require('cookie-parser');
const User = require("./Model/User.js");
const app = express();
const server = require('http').createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const Document = require("./Model/MongoDB.js");
const passport =require("passport");
const createRoom = require('./Routers/createRoom.js');
const fetchRoomData = require('./Routers/fetchHome.js');
const initializePassport = require('./passport');
const {String2HexCodeColor} = require('string-to-hex-code-color');
const io = require('socket.io')(server,{
  cors:
  {
    origin: "http://localhost:3000",
    allowedHeaders: ["*"],
    credentials: true
  }
});
const session = require("express-session")({
  name: 'coder',
  secret: "my-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 15
  }
})


app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(cookieParser("my-secret"));
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

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
	res.setHeader('Access-Control-Allow-Headers', 'content-type,Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

const rooms = new Map();
const string2HexCodeColor = new String2HexCodeColor();

io.on('connection', async (socket) => {
  var id=socket.id;
  var doc;
  var room = socket?.handshake?.query?.room;
  var user=socket?.request?.session?.passport?.user;
  var color = string2HexCodeColor.stringToColor(socket.id,0.5);


  var findRoom = await Document.findById(room);
  if(!user||!room||!findRoom){
    console.log("failed");
    return socket.emit('failed');
  }

  user['socketId'] = socket.id;
  user['color'] =  color;
  user['room'] = room;
  console.log(user);
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

  socket.join(room);

  socket.to(room).emit('connected', user);

  socket.emit('personalData', user);

  socket.emit('userdata', Object.values(rooms.get(room)));

  socket.on('clientRequestedData', (data)=>{
    io.to(data.id).emit('loadDoc', data);
  })

  socket.on('selection', (data) => {
    data.socketId = socket?.id;
    data.color=color;
    socket.to(room).emit('selection', data) ;
  }) 

  socket.on('textChange', (data)=>{
    socket.to(room).emit('textChange', data);
  })

  socket.on("clientLeft", async (id,room,data) => {
    var users = rooms.get(room);
    console.log('clientLeft',users,id,room,data);
    delete users[id];
    rooms.set(room,users);
    socket.to(room).emit("exit", id);
    await Document.findByIdAndUpdate(room, { data })
  });
});

app.use(createRoom);
app.use(fetchRoomData);
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback', (req, res, next) => {
	passport.authenticate('google', (error, user, authInfo) => {
		if (!user) res.redirect('http://localhost:3000/error');
		req.logIn(user, (err) => {
			res.redirect('http://localhost:3000/home');
		});
	})(req, res, next)
});

server.listen(5000,()=>{
  console.log('Server Started at port 5000');
});