const config = require("config");
const Web3Token = require("web3-token");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

const image = { strokes: [], painters: [] };

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);
  socket.emit("image", image);

  socket.on("stroke", async (newStroke, callback) => {
    const { token, size, color, points } = newStroke;

    // Validate token
    let address;

    try {
      const result = await Web3Token.verify(token);
      address = result.address;
    } catch (error) {
      console.log(error);
    }

    if (!address) {
      console.log(`Socket ${socket.id} submittted invalid token`);
      callback(
        "Stroke not broadcasted because you submitted an invalid token. Try reloading your page and logging in and out of your MetaMask account."
      );
      return;
    }

    // Validate stroke
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
      points.filter((point) => {
        return (
          isNaN(point.x) ||
          isNaN(point.y) ||
          point.x < -20 ||
          point.x > 740 ||
          point.y < -20 ||
          point.y > 596
        );
      }).length !== 0 // CHECK IF EVERY POINT HAS X AND Y PROPERTY
    ) {
      console.log(`Socket ${socket.id} submitted invalid stroke`);
      callback("You submitted an invalid stroke. Try reloading your page.");
      return;
    }

    // Add address to painters if not included already
    if (
      !image.painters.find(
        (painter) => painter.toLowerCase() === address.toLowerCase()
      )
    ) {
      image.painters.push(address);
    }

    console.log(`New stroke from: ${socket.id}`);
    image.strokes.push(newStroke);
    callback();

    // Send strokes to others
    socket.broadcast.emit("stroke", newStroke);
  });
});
