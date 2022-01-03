const app = require('express')();
const server = require('http').createServer(app);
const mongoose = require("mongoose");
require("dotenv").config();
const Document = require("./MongoDB.js")

const uri = process.env.MONGODB_URI;
mongoose.connect(uri,  
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log('DATABASE CONNECTED'))
.catch(err => console.error("Error connecting to mongo", err));

const io = require('socket.io')(server,{
  cors:{
    origin: ['http://192.168.1.200:3000']
  }
});

var users = {};

io.on('connection', async (socket) => {
  var id=socket.id;
  var doc;
  var room=socket.handshake.query.search;
  var clients = io.sockets.adapter.rooms.get(room);

  users[socket.id] = {} 
  users[socket.id].user = socket.user = socket.id;
  users[socket.id].color = socket.color = '#FFCBA4';
  socket.emit('userdata', Object.values(users));
  socket.broadcast.emit('connected', {user : socket.id, color : '#FFCBA4'});
  if(clients){
    const clientsArray = Array.from(clients);
    var client = clientsArray[Math.floor(Math.random()*clientsArray.length)];
    io.to(client).emit('giveData',id);
  }
  else {
    doc = await findOrCreateDocument(room);
    socket.emit('loadDoc', doc);
  }
  socket.join(room);
  socket.on('msg', (data)=>{
    socket.to(room).emit('newmsg', data);
  })
  socket.on("saveDoc", async data => {
    await Document.findByIdAndUpdate(room, { data })
  });

  socket.on('sendData', (data)=>{
    io.to(data.id).emit('loadDoc', data);
  })
  socket.on('selection', function (data) {      
    data.color = socket.color
    data.user = socket.user
    socket.broadcast.emit('selection', data) ;
  }) 
});

async function findOrCreateDocument(id) {
  if (id == null) return
  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: '' })
}

server.listen(5000,()=>{
  console.log('Server Started at port 5000');
});