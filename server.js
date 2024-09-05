const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow your frontend URL here
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('sendMessage', (data) => {
    // Broadcast message to the chat room
    io.to(data.chatId).emit('receiveMessage', data);
  });

  socket.on('joinRoom', ({ chatId }) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on('leaveRoom', ({ chatId }) => {
    socket.leave(chatId);
    console.log(`Socket ${socket.id} left room ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Example route
app.get('/', (req, res) => {
  res.send('Socket.IO Server is running');
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
