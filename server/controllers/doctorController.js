const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Doctor login
// @route   POST /api/doctor/login
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

    // Check for doctor
    const doctor = await Doctor.findOne({ email }).select('+password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await doctor.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = doctor.getSignedJwtToken();

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

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Private (Doctor only)
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor.id);

    res.status(200).json({
      success: true,
      profileData: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor only)
exports.getDoctorAppointments = async (req, res) => {
  try {
    // Find all appointments for services with this doctor
    const appointments = await Appointment.find()
      .populate({
        path: 'userId',
        select: 'name image dob gender phone address'
      })
      .populate({
        path: 'serviceId',
        select: 'name'
      });

    // Filter appointments for this doctor
    const doctorAppointments = appointments.filter(appointment => {
      return appointment.doctorId && appointment.doctorId.toString() === req.doctor.id;
    });

    // Format appointments for frontend
    const formattedAppointments = doctorAppointments.map(appointment => {
      return {
        _id: appointment._id,
        userData: {
          name: appointment.userId.name,
          image: appointment.userId.image,
          dob: appointment.userId.dob,
          gender: appointment.userId.gender,
          phone: appointment.userId.phone,
          address: appointment.userId.address
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

// @desc    Complete appointment
// @route   POST /api/doctor/complete-appointment
// @access  Private (Doctor only)
exports.completeAppointment = async (req, res) => {
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

    // Check if the appointment is already cancelled or completed
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    if (appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already completed'
      });
    }

    // Update appointment
    appointment.isCompleted = true;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment completed successfully'
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
// @route   POST /api/doctor/cancel-appointment
// @access  Private (Doctor only)
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

    // Check if the appointment is already cancelled or completed
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    if (appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already completed'
      });
    }

    // Update appointment
    appointment.cancelled = true;
    await appointment.save();

    // Remove booked slot from doctor
    const doctor = await Doctor.findById(req.doctor.id);
    if (doctor && doctor.slots_booked[appointment.slotDate]) {
      // Filter out the cancelled time slot
      const updatedSlots = doctor.slots_booked[appointment.slotDate].filter(
        time => time !== appointment.slotTime
      );

      if (updatedSlots.length === 0) {
        // If no slots left for the date, remove the date
        delete doctor.slots_booked[appointment.slotDate];
      } else {
        // Otherwise update with filtered slots
        doctor.slots_booked[appointment.slotDate] = updatedSlots;
      }

      await doctor.save();
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
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor only)
exports.getDashboardData = async (req, res) => {
  try {
    // Find all appointments for this doctor
    const allAppointments = await Appointment.find();
    
    // Filter appointments for this doctor
    const doctorAppointments = allAppointments.filter(appointment => {
      return appointment.doctorId && appointment.doctorId.toString() === req.doctor.id;
    });
    
    // Count total, completed, and cancelled appointments
    const totalAppointments = doctorAppointments.length;
    const completedAppointments = doctorAppointments.filter(appointment => appointment.isCompleted).length;
    const cancelledAppointments = doctorAppointments.filter(appointment => appointment.cancelled).length;

    // Get today's appointments
    const today = new Date();
    const formattedToday = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
    const todayAppointments = doctorAppointments.filter(appointment => appointment.slotDate === formattedToday);

    // Get unique patients
    const uniquePatients = new Set(doctorAppointments.map(appointment => appointment.userId.toString()));

    // Format today's appointments
    const formattedTodayAppointments = await Promise.all(
      todayAppointments.map(async (appointment) => {
        const user = await User.findById(appointment.userId);
        return {
          _id: appointment._id,
          userData: {
            name: user.name,
            image: user.image
          },
          slotTime: appointment.slotTime,
          cancelled: appointment.cancelled,
          isCompleted: appointment.isCompleted
        };
      })
    );

    res.status(200).json({
      success: true,
      dashData: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalPatients: uniquePatients.size,
        todayAppointments: formattedTodayAppointments
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