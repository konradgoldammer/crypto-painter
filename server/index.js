const config = require("config");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

const image = {};

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.broadcast.to(socket.id).emit(image);
});
