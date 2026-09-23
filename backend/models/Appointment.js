const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  patientName: {
    type: String
  },
  doctorName: {
    type: String
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending'
  },
  reason: {
    type: String,
    maxlength: [300, 'Reason cannot exceed 300 characters']
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
