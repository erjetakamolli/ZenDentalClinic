const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/adminAuth');
const {
  login,
  getAllDoctors,
  changeAvailability,
  getAllAppointments,
  cancelAppointment,
  getDashboardData,
  addService,
  getAllServices,
  changeServiceAvailability
} = require('../controllers/adminController');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/all-doctors', protect, getAllDoctors);
router.post('/change-availability', protect, changeAvailability);
router.get('/appointments', protect, getAllAppointments);
router.post('/cancel-appointment', protect, cancelAppointment);
router.get('/dashboard', protect, getDashboardData);
router.post('/add-service', protect, addService);
router.get('/services', protect, getAllServices);
router.post('/change-service-availability', protect, changeServiceAvailability);

module.exports = router;