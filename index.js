const express = require("express");
const http = require('http');
const {Server} = require('socket.io');
const app = express();
const expressServer = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(expressServer,{
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
  // console.log('a user connected',socket.id);

  let currentRoom = null;

  socket.on("joinRoom", async ({username, room}) => {
    //console.log(username, 'is join the group');

     // leave all other rooms first (optional, if user switches groups)
    // const rooms = Array.from(socket.rooms);
    // rooms.forEach(r => {
    //   if (r !== socket.id) socket.leave(r);
    // });

    // Leave previous room
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    // room e all message send
    await socket.join(room);

    currentRoom = room;
    // io.to('room').emit("roomNotice",username);

    //broadCast
    socket.to(room).emit("roomNotice",username);

    socket.on("chatMessage",({message , room}) => {
      if (!currentRoom) return;
      io.to(room).emit("chatMessage",message);
    })

    socket.on("typing",({username, room}) => {
      // broadCast
      if (!currentRoom) return;
      socket.to(room).emit("typing",username);
    })

    
    socket.on("stopTyping",({username, room}) => {
      // broadCast
      if (!currentRoom) return;
      socket.to(room).emit("stopTyping",username);
    })

    socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  })

});


app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

expressServer.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});