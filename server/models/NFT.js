const mongoose = require("mongoose");

const NFT = mongoose.model(
  "image",
  new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    metadataUrl: { type: String, required: true },
    winner: { type: String, required: true },
  })
);

module.exports = NFT;
