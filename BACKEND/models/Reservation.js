import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    spot: { type: mongoose.Schema.Types.ObjectId, ref: "Spot", required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
