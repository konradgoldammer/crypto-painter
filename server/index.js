const config = require("config");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

const image = { strokes: [] };

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.emit("image", image);

  socket.on("stroke", (newStroke, callback) => {
    // Validate stroke  & auth address
    console.log(`New stroke from: ${socket.id}`);
    image.strokes.push(newStroke);
    callback();

    // Send strokes to others
    socket.broadcast.emit("stroke", newStroke);
  });
});
