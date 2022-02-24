const { createCanvas, loadImage } = require("canvas");
const config = require("config");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const Web3Token = require("web3-token");
const { setIntervalAsync } = require("set-interval-async/dynamic");
const Image = require("./models/Image.js");

const port = config.get("port") || 5000;
const io = require("socket.io")(port, { cors: { origin: "*" } });

const defaultImage = { strokes: [], painters: [] };
let image = defaultImage;

(async () => {
  try {
    // Connect to mongo
    await mongoose.connect(config.get("mongoURI"));
    console.log("Connected to Mongo");

    // Find latest Image in database
    const latestImage = await Image.findOne({}).sort({ timestamp: -1 });

    if (latestImage && !latestImage.final) {
      const { strokes, painters } = latestImage.toObject();
      image = { strokes, painters };
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

      const latestFinalImage = await Image.findOne({ final: true }).sort({
        timestamp: -1,
      });

      if (
        !latestFinalImage ||
        Date.now() - millisInDay > latestFinalImage.timestamp.getTime()
      ) {
        image.final = true;

        // Delete old, non-final images in db
        const { deletedCount } = await Image.deleteMany({
          final: false,
          timestamp: {
            $lt: new Date(Date.now() - config.get("deleteInterval")),
          },
        });

        console.log(`Delted ${deletedCount} old, non-final image objects`);

        // Create Image
        const dataURL = getDataURL(image);

        const data = dataURL.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(data, "base64");
        await fs.writeFile("./tmp/image.png", buffer);
      }

      // Add image to database even if not final
      await new Image(image).save();
      console.log(
        `Added ${image.final ? "final" : "non-final"} image to database`
      );

      // Reset image
      if (image.final) {
        image = { strokes: [], painters: [] };

        io.sockets.emit("reset");

        console.log("Image has been reset");
      }
    }, config.get("saveInterval"));
  } catch (error) {
    console.error(error);
  }
})();

const getDataURL = (image) => {
  console.log("Creating image...");

  const canvas = createCanvas(720, 576);
  const ctx = canvas.getContext("2d");

  image.strokes.forEach((stroke) => {
    // Configure style
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;

    // Draw
    ctx.beginPath();
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
        return;
      }
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
    ctx.closePath();
  });

  return canvas.toDataURL();
};
