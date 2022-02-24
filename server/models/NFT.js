const mongoose = require("mongoose");

const NFT = mongoose.model(
  "NFT",
  new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    urlImage: { type: String, required: true },
    urlMetadata: { type: String, required: true },
    winner: { type: String, required: true },
    tokenId: { type: Number, required: true },
  })
);

module.exports = NFT;
