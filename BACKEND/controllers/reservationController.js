const AcademicBuilding = require('../models/AcademicBuilding');
const ParkingSpot = require('../models/ParkingSpot');
const Reservation = require('../models/Reservation');

// Get all buildings
exports.getBuildings = async (req, res) => {
  const bldgs = await AcademicBuilding.find();
  res.json(bldgs);
};

// Get spots for specific building
exports.getSpotsForBuilding = async (req, res) => {
  const spots = await ParkingSpot.find({ building: req.params.buildingId }).populate({
    path: 'reservations',
    populate: { path: 'user', select: 'name email' }
  });
  res.json(spots);
};

// Reserve a spot
exports.reserveSpot = async (req, res) => {
  const { spotId, fromTime, toTime } = req.body;
  const spot = await ParkingSpot.findById(spotId).populate('reservations');
  const conflict = spot.reservations.some(r =>
    (new Date(fromTime) < r.toTime && new Date(toTime) > r.fromTime)
  );
  if (conflict) return res.status(400).json({ msg: "Time slot already booked" });
  const reservation = await Reservation.create({
    spot: spotId,
    user: req.user._id,
    fromTime, toTime
  });
  spot.reservations.push(reservation._id);
  await spot.save();
  res.json(reservation);
};
