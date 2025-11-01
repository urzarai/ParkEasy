import Spot from "../models/Spot.js";
import Building from "../models/Building.js";

// Add Spot (Admin)
export const addSpot = async (req, res) => {
  const { spotNumber } = req.body;
  const { buildingId } = req.params;

  const building = await Building.findById(buildingId);
  if (!building) return res.status(404).json({ message: "Building not found" });

  const spot = await Spot.create({ spotNumber, building: building._id });
  res.status(201).json({ message: "Parking spot added successfully", spot });
};

// Get Spots by Building
export const getSpotsByBuilding = async (req, res) => {
  const spots = await Spot.find({ building: req.params.buildingId });
  res.json(spots);
};

// Delete Spot
export const deleteSpot = async (req, res) => {
  await Spot.findByIdAndDelete(req.params.id);
  res.json({ message: "Spot deleted" });
};
