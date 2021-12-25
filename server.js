const app = require('express')();
const server = require('http').createServer(app);
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://DarkFaze:1+2=Three@viveksrivastava.o8sce.mongodb.net/Chat-App?retryWrites=true&w=majority")

const documentSchema = new mongoose.Schema({
  _id: String,
  data: Object,
})

const Document = mongoose.model('Document', documentSchema);

const io = require('socket.io')(server,{
  cors:{
    origin: ['http://localhost:3000']
  }
});

io.on('connection', async (socket) => {
  const room=socket.handshake.query.search;
  const doc = await findOrCreateDocument(room);
  socket.join(room);
  socket.emit('loadDoc', doc);
  socket.on('msg', (data)=>{
    console.log(data);
    socket.to(room).emit('newmsg', data);
 })
 socket.on("saveDoc", async data => {
  await Document.findByIdAndUpdate(room, { data })
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