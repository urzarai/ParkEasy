const mongoose = require('mongoose');

const academicBuildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AcademicBuilding', academicBuildingSchema);
