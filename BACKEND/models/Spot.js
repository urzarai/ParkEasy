import mongoose from "mongoose";

const spotSchema = new mongoose.Schema(
  {
    spotNumber: { type: String, required: true, unique: true },
    building: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Spot", spotSchema);
