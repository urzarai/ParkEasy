const AcademicBuilding = require('../models/AcademicBuilding');
const ParkingSpot = require('../models/ParkingSpot');

// Academic Building
exports.addBuilding = async (req, res) => {
  const { name, abbreviation } = req.body;
  const building = new AcademicBuilding({ name, abbreviation });
  await building.save();
  res.json(building);
};

exports.editBuilding = async (req, res) => {
  const building = await AcademicBuilding.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(building);
};

exports.deleteBuilding = async (req, res) => {
  await AcademicBuilding.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};

// Parking Spot
exports.addSpot = async (req, res) => {
  const { spotId, buildingId } = req.body;
  const spot = new ParkingSpot({ spotId, building: buildingId });
  await spot.save();
  res.json(spot);
};

exports.editSpot = async (req, res) => {
  const spot = await ParkingSpot.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(spot);
};

exports.deleteSpot = async (req, res) => {
  await ParkingSpot.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
