import React from 'react';
import AppointmentCard from '../components/AppointmentCard';

const HomePage = () => {
  const featuredAppointments = [
    {
      id: 1,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Sarah Jenkins',
      date: '2026-10-12',
      timeSlot: '09:00 AM',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'Robert Brown',
      doctorName: 'Dr. Robert Chen',
      date: '2026-10-14',
      timeSlot: '11:30 AM',
      status: 'pending'
    },
    {
      id: 3,
      patientName: 'Emily Taylor',
      doctorName: 'Dr. Michael Vance',
      date: '2026-10-18',
      timeSlot: '03:00 PM',
      status: 'cancelled'
    }
  ];

  return (
    <div>
      <h1 className="page-title">MedCare Plus Hospital</h1>
      <p className="page-subtitle">Welcome to MedCare Plus - Your trusted partner in healthcare excellence.</p>
      
      <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Recent Scheduled Appointments</h2>
      <div className="grid-layout">
        {featuredAppointments.map(app => (
          <AppointmentCard
            key={app.id}
            patientName={app.patientName}
            doctorName={app.doctorName}
            date={app.date}
            timeSlot={app.timeSlot}
            status={app.status}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
