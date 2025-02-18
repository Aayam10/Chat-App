require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('new user', (username) => {
    users.push(username);
    io.emit('user list', users);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    users = users.filter(user => user !== socket.username);
    io.emit('user list', users);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

