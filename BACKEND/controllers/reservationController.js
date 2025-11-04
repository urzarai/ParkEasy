import Reservation from "../models/Reservation.js";
import Spot from "../models/Spot.js";
import User from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

// Reserve a spot
export const reserveSpot = async (req, res) => {
  const { from, to } = req.body;
  const { spotId } = req.params;

  const spot = await Spot.findById(spotId);
  if (!spot) return res.status(404).json({ message: "Spot not found" });

  const reservation = await Reservation.create({
    user: req.user.id,
    spot: spot._id,
    from,
    to,
  });

  spot.isAvailable = false;
  await spot.save();

  // send confirmation email to user (best-effort)
  try {
    const user = await User.findById(req.user.id).select("name email");
    if (user && user.email) {
      const subject = `Parking reservation confirmed - Spot ${spot.spotNumber || spot._id}`;
      const text = `Hi ${user.name || "User"},\n\nYour parking spot has been reserved successfully.\n\nDetails:\nSpot: ${spot.spotNumber || spot._id}\nFrom: ${from}\nTo: ${to}\n\nThanks,\nParkEasy`;
      const html = `<p>Hi ${user.name || "User"},</p><p>Your parking spot has been reserved successfully.</p><ul><li><strong>Spot:</strong> ${spot.spotNumber || spot._id}</li><li><strong>From:</strong> ${from}</li><li><strong>To:</strong> ${to}</li></ul><p>Thanks,<br/>ParkEasy</p>`;

      await sendMail({ to: user.email, subject, text, html });
    }
  } catch (err) {
    // log and continue - don't fail reservation if email sending fails
    console.error("Failed to send reservation email:", err);
  }

  res.status(201).json({ message: "Spot reserved successfully", reservation });
};

// Get reservations for a building
export const getReservationsByBuilding = async (req, res) => {
  const reservations = await Reservation.find()
    .populate("user", "name")
    .populate("spot", "spotNumber")
    .exec();

  res.json(reservations);
};
