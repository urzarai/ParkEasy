const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');

// Get all buildings
router.get('/buildings', auth, reservationController.getBuildings);

// Get spots for a building
router.get('/spots/:buildingId', auth, reservationController.getSpotsForBuilding);

// Reserve a spot
router.post('/reserve', auth, reservationController.reserveSpot);

module.exports = router;
