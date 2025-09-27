import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  reportedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Incident", incidentSchema);
