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

const rooms = new Map();

io.on('connection', async (socket) => {
  var id=socket.id;
  var doc;
  var room=socket.handshake.query.search;
  var user = { id:socket.id,color:'#FFCBA4'};

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
    doc = await findOrCreateDocument(room);
    socket.emit('loadDoc', doc,Object.values(users));
  }

  socket.join(room);

  socket.to(room).emit('connected', user);

  socket.emit('');

  socket.emit('userdata', Object.values(rooms.get(room)));

  socket.on('clientRequestedData', (data)=>{
    io.to(data.id).emit('loadDoc', data);
  })

  socket.on('selection', function (data) {      
    data.color = '#FFCBA4'
    data.user = socket.id
    socket.to(room).emit('selection', data) ;
  }) 

  socket.on('textChange', (data)=>{
    socket.to(room).emit('textChange', data);
  })

  socket.on("clientLeft", async (id,room,data) => {
    var users = rooms.get(room);
    delete users[id];
    rooms.set(room,users);
    await Document.findByIdAndUpdate(room, { data })
  });

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