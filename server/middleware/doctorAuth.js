// middleware/doctorAuth.js
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');

// Protect doctor routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.dtoken) {
    token = req.headers.dtoken;
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.DOCTOR_JWT_SECRET);

    // Find doctor by id
    req.doctor = await Doctor.findById(decoded.id);

    if (!req.doctor) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};