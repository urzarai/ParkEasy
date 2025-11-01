const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Academic Building routes
router.post('/building', auth, adminAuth, adminController.addBuilding);
router.put('/building/:id', auth, adminAuth, adminController.editBuilding);
router.delete('/building/:id', auth, adminAuth, adminController.deleteBuilding);

// Parking Spot routes
router.post('/spot', auth, adminAuth, adminController.addSpot);
router.put('/spot/:id', auth, adminAuth, adminController.editSpot);
router.delete('/spot/:id', auth, adminAuth, adminController.deleteSpot);

module.exports = router;
