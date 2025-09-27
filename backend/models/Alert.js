import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

export default mongoose.model("Alert", alertSchema);
