const mongoose = require("mongoose");

const Image = mongoose.model(
  "image",
  new mongoose.Schema({
    timestamp: { type: Date, expires: 86400, default: Date.now },
    strokes: { type: Array, required: true },
    painters: { type: Array, required: true },
    final: { type: Boolean, default: false },
  })
);

module.exports = Image;
