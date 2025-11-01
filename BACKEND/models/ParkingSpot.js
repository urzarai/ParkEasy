const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  spotId: { type: String, required: true, unique: true },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicBuilding', required: true },
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
