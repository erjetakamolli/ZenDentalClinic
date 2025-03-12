const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById
} = require('../controllers/serviceController');

// Public routes
router.get('/list', getServices);
router.get('/:id', getServiceById);

module.exports = router;