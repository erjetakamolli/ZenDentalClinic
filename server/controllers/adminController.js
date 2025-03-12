const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all doctors
// @route   POST /api/admin/all-doctors
// @access  Private (Admin only)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).json({
      success: true,
      doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Change doctor availability
// @route   POST /api/admin/change-availability
// @access  Private (Admin only)
exports.changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // Find doctor
    const doctor = await Doctor.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Toggle availability
    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: `Doctor availability ${doctor.isAvailable ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: 'userId',
        select: 'name image dob'
      })
      .populate({
        path: 'serviceId',
        select: 'name'
      });

    // Format appointment data for frontend
    const formattedAppointments = appointments.map(appointment => {
      return {
        _id: appointment._id,
        userData: {
          name: appointment.userId.name,
          image: appointment.userId.image,
          dob: appointment.userId.dob
        },
        serviceName: appointment.serviceId.name,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        amount: appointment.amount,
        isPaid: appointment.isPaid,
        isCompleted: appointment.isCompleted,
        cancelled: appointment.cancelled,
        createdAt: appointment.createdAt
      };
    });

    res.status(200).json({
      success: true,
      appointments: formattedAppointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Cancel appointment
// @route   POST /api/admin/cancel-appointment
// @access  Private (Admin only)
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Find appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update appointment
    appointment.cancelled = true;
    await appointment.save();

    // Remove booked slot from service
    const service = await Service.findById(appointment.serviceId);
    if (service && service.slots_booked[appointment.slotDate]) {
      // Filter out the cancelled time slot
      const updatedSlots = service.slots_booked[appointment.slotDate].filter(
        time => time !== appointment.slotTime
      );

      if (updatedSlots.length === 0) {
        // If no slots left for the date, remove the date
        delete service.slots_booked[appointment.slotDate];
      } else {
        // Otherwise update with filtered slots
        service.slots_booked[appointment.slotDate] = updatedSlots;
      }

      await service.save();
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get dashboard data
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardData = async (req, res) => {
  try {
    // Count appointments, patients, and services
    const appointmentsCount = await Appointment.countDocuments();
    const patientsCount = await User.countDocuments();
    const servicesCount = await Service.countDocuments();

    // Get latest appointments
    const latestAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'userId',
        select: 'name image'
      })
      .populate({
        path: 'serviceId',
        select: 'name'
      });

    // Format latest appointments for frontend
    const formattedLatestAppointments = latestAppointments.map(appointment => {
      return {
        _id: appointment._id,
        userData: {
          name: appointment.userId.name,
          image: appointment.userId.image
        },
        serviceName: appointment.serviceId.name,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        amount: appointment.amount,
        isCompleted: appointment.isCompleted,
        cancelled: appointment.cancelled
      };
    });

    res.status(200).json({
      success: true,
      dashData: {
        appointments: appointmentsCount,
        patients: patientsCount,
        services: servicesCount,
        latestAppointments: formattedLatestAppointments
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Add service
// @route   POST /api/admin/add-service
// @access  Private (Admin only)
exports.addService = async (req, res) => {
  try {
    const { name, description, available, fees = 100 } = req.body;

    // Check if service with the same name already exists
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this name already exists'
      });
    }

    // Check if image is uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const file = req.files.image;

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'zendental/services',
      width: 300,
      crop: 'scale'
    });

    // Create service
    const service = await Service.create({
      name,
      description,
      available: available === 'true' || available === true,
      fees: fees || 100,
      image: result.secure_url
    });

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private (Admin only)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Change service availability
// @route   POST /api/admin/change-service-availability
// @access  Private (Admin only)
exports.changeServiceAvailability = async (req, res) => {
  try {
    const { serviceId } = req.body;

    // Find service
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Toggle availability
    service.available = !service.available;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service availability ${service.available ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};