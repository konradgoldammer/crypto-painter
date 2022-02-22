const config = require("config");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

const image = { strokes: [] };

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.emit("image", image);

  socket.on("stroke", (newStroke, callback) => {
    // Validate stroke
    const { size, color, points } = newStroke;
    console.log(size);
    if (
      !size ||
      !color ||
      !points ||
      typeof size !== "number" ||
      typeof color !== "string" ||
      !Array.isArray(points) ||
      size < 3 ||
      size > 20 ||
      !/^#[0-9A-F]{6}$/i.test(color) || // CHECK IF IS REAL HEX COLOR
      points.filter((point) => !(point.x && point.y)).length !== 0 // CHECK IF EVERY POINT HAS X AND Y PROPERTY
    ) {
      callback("You submitted an invalid stroke. Try reloading your page.");
      return;
    }

    console.log(`New stroke from: ${socket.id}`);
    image.strokes.push(newStroke);
    callback();

    // Send strokes to others
    socket.broadcast.emit("stroke", newStroke);
  });
});
