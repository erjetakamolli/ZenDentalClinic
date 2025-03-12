// models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    required: [false, 'Please add an image']
  },
  available: {
    type: Boolean,
    default: true
  },
  fees: {
    type: Number,
    required: [true, 'Please add service fee']
  },
  slots_booked: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
