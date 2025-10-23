const express = require("express");
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const expressServer = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(expressServer,{
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.id);

  socket.on("joinRoom", async (username) => {
    //console.log(username, 'is join the group');

    // room e all message send
    await socket.join('room');
    // io.to('room').emit("roomNotice",username);

    //broadCast
    socket.to('room').emit("roomNotice",username);

    socket.on("chatMessage",(msg) => {
      io.to('room').emit("chatMessage",msg);
    })

    socket.on("typing",(data) => {
      // broadCast
      socket.to('room').emit("typing",data);
    })

    
    socket.on("stopTyping",(data) => {
      // broadCast
      socket.to('room').emit("stopTyping",data);
    })

  })

});


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

expressServer.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});