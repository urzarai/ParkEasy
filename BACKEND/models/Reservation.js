const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  spot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromTime: { type: Date, required: true },
  toTime: { type: Date, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);
