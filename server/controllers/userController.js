const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const cloudinary = require('../utils/cloudinary');

// @desc    Register user
// @route   POST /api/user/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Login user
// @route   POST /api/user/login
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

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/user/get-profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update user profile
// @route   POST /api/user/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob } = req.body;
    let address = JSON.parse(req.body.address || '{}');

    const updateData = {
      name,
      phone,
      gender,
      dob,
      address
    };

    // Handle profile image upload
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'zendental/profiles',
        width: 200,
        crop: 'scale'
      });

      updateData.image = result.secure_url;
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Book appointment
// @route   POST /api/user/book-appointment
// @access  Private
exports.bookAppointment = async (req, res) => {
  try {
    const { serId, slotDate, slotTime } = req.body;

    // Find service
    const service = await Service.findById(serId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if service is available
    if (!service.available) {
      return res.status(400).json({
        success: false,
        message: 'Service is not available'
      });
    }

    // Check if the slot is already booked
    if (
      service.slots_booked[slotDate] &&
      service.slots_booked[slotDate].includes(slotTime)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Slot is already booked'
      });
    }

    // Update service slots
    if (!service.slots_booked[slotDate]) {
      service.slots_booked[slotDate] = [];
    }
    service.slots_booked[slotDate].push(slotTime);
    await service.save();

    // Create appointment
    const appointment = await Appointment.create({
      userId: req.user.id,
      serviceId: serId,
      slotDate,
      slotTime,
      amount: service.fees
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get user appointments
// @route   GET /api/user/appointments
// @access  Private
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .populate({
        path: 'serviceId',
        select: 'name image fees'
      });

    // Format appointments for frontend
    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const service = await Service.findById(appointment.serviceId);
        
        return {
          _id: appointment._id,
          docData: {
            name: service.name,
            image: service.image,
            speciality: service.description,
            address: {
              line1: 'Myslym Shyri Street',
              line2: 'Tirana, Albania'
            }
          },
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
          amount: appointment.amount,
          isPaid: appointment.isPaid,
          isCompleted: appointment.isCompleted,
          cancelled: appointment.cancelled,
          createdAt: appointment.createdAt
        };
      })
    );

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
// @route   POST /api/user/cancel-appointment
// @access  Private
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

    // Check if the appointment belongs to the user
    if (appointment.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    // Check if the appointment is already cancelled or completed
    if (appointment.cancelled || appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled or completed'
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