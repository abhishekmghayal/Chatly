const { Server } = require("socket.io");

let io;

const userSocketMap = {};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
      userSocketMap[userId] = socket.id;

      console.log(userSocketMap);
      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
    socket.on("call-user", (data) => {
      io.emit("incoming-call", data);
    });
    socket.on("disconnect", () => {
      for (const userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];

          break;
        }
      }
      io.emit("onlineUsers", Object.keys(userSocketMap));

      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = {
  initializeSocket,
  getIO: () => io,
  userSocketMap,
};
