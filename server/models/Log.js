const mongoose = require("mongoose");

const Log = mongoose.model(
  "Log",
  new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    connections: { type: Array, required: true },
    painters: { type: Array, required: true },
    messengers: {type: Array, required: true}
    maxConnections: { type: Number, required: true },
    totalStrokes: { type: Number, required: true },
    totalMessages: { type: Number, required: true },
    totalLogins: { type: Number, required: true },
  })
);

module.exports = Log;
