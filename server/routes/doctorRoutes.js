const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/doctorAuth');
const {
  login,
  getProfile,
  getDoctorAppointments,
  completeAppointment,
  cancelAppointment,
  getDashboardData
} = require('../controllers/doctorController');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/appointments', protect, getDoctorAppointments);
router.post('/complete-appointment', protect, completeAppointment);
router.post('/cancel-appointment', protect, cancelAppointment);
router.get('/dashboard', protect, getDashboardData);

module.exports = router;