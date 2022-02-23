import mongoose from "mongoose";

export const Image = mongoose.model(
  "image",
  new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    strokes: { type: Array, required: true },
    painters: { type: Array, required: true },
    final: { type: Boolean, default: false },
  })
);
