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

io.on('connection', async (socket) => {
  var doc;
  const room=socket.handshake.query.search;
  var clients = io.sockets.adapter.rooms.get(room);
  if(clients){
    const [client] = clients;
    console.log(socket.id,client);
    io.to(client).emit('giveData','giveData');
    socket.on('sendData',(data)=>{
      console.log("data"+data);
      io.to(socket.id).emit('loadDoc', data);
    })
  }
  doc = await findOrCreateDocument(room);
  socket.join(room);
  socket.emit('loadDoc', doc);
  socket.on('msg', (data)=>{
    socket.to(room).emit('newmsg', data);
 })
 socket.on("saveDoc", async data => {
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