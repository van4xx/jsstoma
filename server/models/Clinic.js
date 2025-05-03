const mongoose = require('mongoose');

const ClinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contact: {
    phone: String,
    email: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Clinic', ClinicSchema); 