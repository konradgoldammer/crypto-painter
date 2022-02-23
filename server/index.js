const config = require("config");
const mongoose = require("mongoose");
const Web3Token = require("web3-token");
const { setIntervalAsync } = require("set-interval-async/dynamic");
const Image = require("./models/Image.js");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

let image = { strokes: [], painters: [] };

(async () => {
  try {
    // Connect to mongo
    await mongoose.connect(config.get("mongoURI"));
    console.log("Connected to Mongo");

    // Find latest Image in database
    const latestImage = await Image.findOne({}).sort({ timestamp: -1 });
    console.log(latestImage);

    if (!latestImage.final) {
      image = latestImage.toObject();
    }

    // Listen for new connections
    io.on("connection", (socket) => {
      console.log(`New connection: ${socket.id}`);
      socket.emit("image", image);

      // Listen for new strrokes
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

    // Save image every interval
    setIntervalAsync(async () => {
      // Detect if its time to reset image
      // UTC TIME!!!
      const date = new Date();
      const millisInDay =
        (date.getUTCSeconds() +
          60 * date.getUTCMinutes() +
          60 * 60 * date.getUTCHours()) *
        1000;

      const finalImages = await Image.find({
        timestamp: {
          $gte: new Date(Date.now() - config.get("saveInterval")),
          final: true,
        },
      });

      if (
        millisInDay < config.get("saveInterval") &&
        finalImages.length === 0
      ) {
        image.final = true;

        // Delete old, non-final images in db
        const { deletedCount } = await Image.deleteMany({
          final: false,
          timestamp: { $lt: new Date(Date.now() - 86400000) },
        });

        console.log(`Delted ${deletedCount} old, non-final image objects`);

        // mint nft
      }

      await new Image(image).save();
      console.log("Added FINAL img to database");

      // Reset image
      if (image.final) {
        image = {};
      }
    }, config.get("saveInterval"));
  } catch (error) {
    console.error(error);
  }
})();
