import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    lat: Number,
    lng: Number
  },
  contactsNotified: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SOS", sosSchema);
