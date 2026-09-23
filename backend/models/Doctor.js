const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  email: {
    type: String
  },
  specialisation: {
    type: String,
    required: [true, 'Specialisation is required']
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
