import React from 'react';

const AppointmentCard = ({ patientName, doctorName, date, timeSlot, status }) => {
  const statusClass = status ? `status-${status.toLowerCase()}` : 'status-pending';

  return (
    <div className="appointment-card">
      <div className="card-header">
        <span className="patient-name">{patientName}</span>
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="card-detail">
        <span className="detail-label">Doctor:</span>
        <span className="detail-value">{doctorName}</span>
      </div>
      <div className="card-detail">
        <span className="detail-label">Date:</span>
        <span className="detail-value">{date}</span>
      </div>
      <div className="card-detail">
        <span className="detail-label">Time Slot:</span>
        <span className="detail-value">{timeSlot}</span>
      </div>
      <div className="card-detail">
        <span className="detail-label">Status:</span>
        <span className="detail-value">{status}</span>
      </div>
    </div>
  );
};

export default AppointmentCard;
