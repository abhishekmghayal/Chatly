// Sample WebRTC signaling handlers for Socket.IO
// Usage: require and call attachSignaling(io) after initializing Socket.IO

function attachSignaling(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Forward offer to target
    socket.on("call-user", ({ to, offer, from }) => {
      io.to(to).emit("incoming-call", { from, offer });
    });

    // Forward answer to caller
    socket.on("answer-call", ({ to, answer, from }) => {
      io.to(to).emit("call-accepted", { from, answer });
    });

    // Exchange ICE candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", { candidate, from: socket.id });
    });

    // Simple presence / list
    socket.on("join-room", ({ room }) => {
      socket.join(room);
      socket.to(room).emit("user-joined", { id: socket.id });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      socket.broadcast.emit("user-disconnected", { id: socket.id });
    });
  });
}

module.exports = { attachSignaling };
