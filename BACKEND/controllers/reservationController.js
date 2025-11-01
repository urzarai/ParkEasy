import Reservation from "../models/Reservation.js";
import Spot from "../models/Spot.js";

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
