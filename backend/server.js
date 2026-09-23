const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;

let isMongoConnected = false;

const initialDoctors = [
  { _id: 'doc1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@medcare.com', specialisation: 'Cardiology', available: true },
  { _id: 'doc2', name: 'Dr. Robert Chen', email: 'robert.chen@medcare.com', specialisation: 'Neurology', available: true },
  { _id: 'doc3', name: 'Dr. Emily Adams', email: 'emily.adams@medcare.com', specialisation: 'Pediatrics', available: false },
  { _id: 'doc4', name: 'Dr. Michael Vance', email: 'michael.vance@medcare.com', specialisation: 'Orthopedics', available: true }
];

let inMemoryAppointments = [
  {
    _id: 'app1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-10-15',
    timeSlot: '10:00 AM',
    status: 'confirmed',
    reason: 'Routine cardiac checkup'
  },
  {
    _id: 'app2',
    patientName: 'Alice Smith',
    doctorName: 'Dr. Robert Chen',
    date: '2026-10-16',
    timeSlot: '02:30 PM',
    status: 'pending',
    reason: 'Migraine evaluation'
  }
];

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medcare';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('MongoDB connected successfully');
    
    const count = await Doctor.countDocuments();
    if (count === 0) {
      await Doctor.insertMany(initialDoctors.map(d => ({
        name: d.name,
        email: d.email,
        specialisation: d.specialisation,
        available: d.available
      })));
    }
  } catch (error) {
    isMongoConnected = false;
    console.log('MongoDB connection skipped or unavailable, using in-memory data store');
  }
};

connectDB();

app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${req.method}] [${req.path}] [${timestamp}]`);
  next();
};

app.use(requestLogger);

app.get('/api/v1/doctors', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const doctors = await Doctor.find();
      return res.status(200).json({ success: true, data: doctors });
    }
    return res.status(200).json({ success: true, data: initialDoctors });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/appointments', async (req, res, next) => {
  try {
    if (isMongoConnected) {
      const appointments = await Appointment.find().populate('patientId doctorId');
      return res.status(200).json({ success: true, data: appointments });
    }
    return res.status(200).json({ success: true, data: inMemoryAppointments });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/appointments', async (req, res, next) => {
  try {
    const { patientName, doctorName, date, timeSlot, status, reason, patientId, doctorId } = req.body;
    
    if (!patientName && !patientId) {
      const err = new Error('Patient name is required');
      err.statusCode = 400;
      throw err;
    }
    
    if (isMongoConnected) {
      const appointment = new Appointment({
        patientId: patientId || undefined,
        doctorId: doctorId || undefined,
        patientName: patientName || 'Patient',
        doctorName: doctorName || 'Doctor',
        date,
        timeSlot,
        status: status || 'pending',
        reason
      });
      const savedAppointment = await appointment.save();
      return res.status(201).json({ success: true, data: savedAppointment });
    }

    const newAppointment = {
      _id: Date.now().toString(),
      patientName,
      doctorName,
      date,
      timeSlot,
      status: status || 'pending',
      reason: reason || ''
    };
    inMemoryAppointments.push(newAppointment);
    return res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    next(error);
  }
});

app.post('/api/v1/validation-test', async (req, res, next) => {
  try {
    const testAppointment = new Appointment(req.body);
    await testAppointment.validate();
    return res.status(200).json({ success: true, message: 'Validation passed successfully' });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  res.status(statusCode).json({
    success: false,
    error: message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
