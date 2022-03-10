const { instrument } = require("@socket.io/admin-ui");
const { createCanvas, loadImage } = require("canvas");
const config = require("config");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const CryptoPainting = require("./contracts/CryptoPainting.json");
const Web3 = require("web3");
const Web3Token = require("web3-token");
const { setIntervalAsync } = require("set-interval-async/dynamic");
const Image = require("./models/Image.js");
const NFT = require("./models/NFT.js");
const { Web3Storage, getFilesFromPath } = require("web3.storage");

const address = config.get("address");
const privateKey = config.get("privateKey");
const port = process.env.PORT || 3000;

const io = require("socket.io")(port, { cors: { origin: "*" } });
instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: config.get("passwordSocketAdmin"),
  },
});

const defaultImage = { strokes: [], painters: [] };
let image = defaultImage;

let latestNFT = null;
let latestWinnerHasConnected = false;

(async () => {
  try {
    // Configure Web3
    const web3 = new Web3("https://bsc-dataseed.binance.org/");
    const networkId = await web3.eth.net.getId();
    const cryptoPainting = new web3.eth.Contract(
      CryptoPainting.abi,
      CryptoPainting.networks[networkId].address
    );

    // Configure Web3Storage
    const apiToken = config.get("web3StorageApiToken");
    const storage = new Web3Storage({ token: apiToken });

    // Connect to mongo
    await mongoose.connect(config.get("mongoURI"));
    console.log("Connected to Mongo");

    // Find latest NFT in database
    latestNFT = await NFT.findOne({}).sort({ timestamp: -1 });

    // Find latest Image in database
    const latestImage = await Image.findOne({}).sort({ timestamp: -1 });

    if (latestImage && !latestImage.final) {
      const { strokes, painters } = latestImage.toObject();
      image = { strokes, painters };
    }

    // Listen for new connections
    io.on("connection", (socket) => {
      console.log(`New connection: ${socket.id}`);
      socket.on("image", (callback) => {
        callback(image);
      });

      socket.on("login", (account, callback) => {
        if (
          account &&
          !latestWinnerHasConnected &&
          latestNFT &&
          account.toLowerCase() === latestNFT.winner.toLowerCase()
        ) {
          latestWinnerHasConnected = true;
          callback(latestNFT);
        }
        callback();
      });

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

        if (points.length > 200) {
          console.log(`Socket ${socket.id} submitted too long stroke`);
          callback(
            "Stroke not broadcasted because too long 😢. You should reload your page."
          );
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
      // Detect if it's time to reset image
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

        // Create Image
        const dataURL = getDataURL(image);

        const dataImage = dataURL.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(dataImage, "base64");
        const pathImage = "./tmp/image.png";
        await fs.writeFile(pathImage, buffer);
        console.log("Created image.png");

        // Upload Image to IPFS
        const fileImage = await getFilesFromPath(pathImage);
        const cidImage = await storage.put(fileImage);
        const urlImage = `ipfs://${cidImage}`;
        console.log(`Image added to IPFS with cid: ${cidImage}`);

        // Create Metadata
        const metadataObject = {
          name: `Crypto-Painting of ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`,
          description: `This Crypto-Painting was created collectively by ${
            image.painters.length
          } cryptopainter.art users from ${
            latestNFT ? latestNFT.timestamp.toUTCString() : "X"
          } until ${new Date().toUTCString()}.`,
          image: urlImage,
        };

        const jsonContent = JSON.stringify(metadataObject);

        const pathMetadata = "./tmp/metadata.json";
        await fs.writeFile(pathMetadata, jsonContent, "utf-8");
        console.log("Created metadata.json");

        // Upload Metadata to IPFS
        const fileMetadata = await getFilesFromPath(pathMetadata);
        const cidMetadata = await storage.put(fileMetadata);
        const urlMetadata = `ipfs://${cidMetadata}/metadata.json`;
        console.log(`Metadata added to IPFS with cid: ${cidMetadata}`);

        // Determine winner
        const winner =
          image.painters[Math.floor(Math.random() * image.painters.length)] ||
          address;

        console.log(`Determined the winner: ${winner}`);

        // Mint NFT
        const tx = cryptoPainting.methods.awardItem(
          winner,
          cidImage,
          urlMetadata
        );
        const gas = await tx.estimateGas({ from: address });
        const gasPrice = await web3.eth.getGasPrice();
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(address);

        const signedTx = await web3.eth.accounts.signTransaction(
          {
            to: cryptoPainting.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId,
          },
          privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction
        );
        console.log(`TransactionHash: ${receipt.transactionHash}`);

        latestNFT = {
          urlImage,
          urlMetadata,
          winner,
          tokenId: Web3.utils.hexToNumber(receipt.logs[0].topics[3]),
          transaction: receipt.transactionHash,
        };

        await new NFT(latestNFT).save();
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

  // Configure general style
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalAlpha = "1";

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
