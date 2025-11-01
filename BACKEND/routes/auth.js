const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', auth, authController.profile);
router.post('/logout', auth, authController.logout);

module.exports = router;
