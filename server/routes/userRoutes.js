const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/userAuth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  bookAppointment,
  getUserAppointments,
  cancelAppointment
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/get-profile', protect, getProfile);
router.post('/update-profile', protect, updateProfile);
router.post('/book-appointment', protect, bookAppointment);
router.get('/appointments', protect, getUserAppointments);
router.post('/cancel-appointment', protect, cancelAppointment);

module.exports = router;