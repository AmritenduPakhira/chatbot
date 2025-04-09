const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const Message = require('./models/Message'); 
const connectDB = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/messages', require('./routes/messages'));

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log("User connected");

  socket.on('sendMessage', (data) => {
    console.log('Received:', data);
    const reply = { text: "You said: " + data.text };
    socket.emit('botReply', reply);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
