import React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: 'Dr. Sarah Jenkins',
    date: '',
    timeSlot: '09:00 AM',
    reason: ''
  });

  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah Jenkins');
  const [appointments, setAppointments] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/appointments');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAppointments(data.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'doctorName') {
      setSelectedDoctor(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date) {
      setSubmitMessage('Please fill in required fields (Patient Name & Date).');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitMessage(`Appointment successfully booked for ${formData.patientName}!`);
        setAppointments(prev => [...prev, data.data]);
        setFormData({
          patientName: '',
          doctorName: selectedDoctor,
          date: '',
          timeSlot: '09:00 AM',
          reason: ''
        });
      } else {
        setSubmitMessage(`Booking failed: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      setSubmitMessage('Failed to connect to backend server.');
    }
  };

  return (
    <div>
      <h1 className="page-title">Book an Appointment</h1>
      <p className="page-subtitle">Schedule a consultation with our medical specialists.</p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patientName">Patient Name</label>
              <input
                type="text"
                id="patientName"
                name="patientName"
                className="form-control"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="doctorName">Doctor Name</label>
              <select
                id="doctorName"
                name="doctorName"
                className="form-control"
                value={formData.doctorName}
                onChange={handleChange}
              >
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                <option value="Dr. Robert Chen">Dr. Robert Chen (Neurology)</option>
                <option value="Dr. Emily Adams">Dr. Emily Adams (Pediatrics)</option>
                <option value="Dr. Michael Vance">Dr. Michael Vance (Orthopedics)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                className="form-control"
                value={formData.timeSlot}
                onChange={handleChange}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reason">Reason for Visit</label>
              <textarea
                id="reason"
                name="reason"
                className="form-control"
                rows="3"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason"
                maxLength="300"
              />
            </div>

            <button type="submit" className="btn-primary">Book Appointment</button>
          </form>

          {submitMessage && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '0.375rem' }}>
              {submitMessage}
            </div>
          )}

          <div className="live-preview">
            <strong>Live Form Preview State:</strong><br />
            Patient: {formData.patientName || '(Waiting for input...)'}<br />
            Selected Doctor: {selectedDoctor}<br />
            Scheduled Date: {formData.date || '(Not selected)'} at {formData.timeSlot}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '320px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Existing Appointments</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.length > 0 ? (
              appointments.map((app, idx) => (
                <AppointmentCard
                  key={app._id || idx}
                  patientName={app.patientName || 'Patient'}
                  doctorName={app.doctorName || 'Doctor'}
                  date={app.date}
                  timeSlot={app.timeSlot}
                  status={app.status || 'pending'}
                />
              ))
            ) : (
              <p style={{ color: '#64748b' }}>No appointments booked yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
