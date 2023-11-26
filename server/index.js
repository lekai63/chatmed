// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('new_message', (message) => {
    console.log('Message received:', message);
    // 处理消息逻辑
    // ...

    // 响应客户端
io.emit('new_message', { content: JSON.stringify({ text: 'Response from server', ...someData }) });

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// const PORT = process.env.PORT || 9876;
const PORT = 9876;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
