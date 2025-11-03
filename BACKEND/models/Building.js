import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    abbreviation: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Building", buildingSchema);
