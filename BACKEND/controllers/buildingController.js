import Building from "../models/Building.js";

// Add Building (Admin)
export const addBuilding = async (req, res) => {
  try {
    const { name, abbreviation } = req.body;
    const building = await Building.create({ name, abbreviation });
    res.status(201).json({ message: "Building created successfully", building });
  } catch (err) {
    res.status(500).json({ message: "Error adding building" });
  }
};

// Get All Buildings
export const getBuildings = async (req, res) => {
  const buildings = await Building.find();
  res.json(buildings);
};

// Edit Building
export const editBuilding = async (req, res) => {
  const updated = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Building updated", updated });
};

// Delete Building
export const deleteBuilding = async (req, res) => {
  await Building.findByIdAndDelete(req.params.id);
  res.json({ message: "Building deleted" });
};
