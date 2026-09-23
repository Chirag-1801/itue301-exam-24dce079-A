import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/v1/doctors');
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: Status ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setData(result.data);
        } else if (Array.isArray(result)) {
          setData(result);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        setError(err.message || 'Error fetching doctor data');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading doctor profiles...</h2>
        <p>Please wait while we connect to MedCare Plus server.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Unable to load doctors</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Medical Specialists</h1>
      <p className="page-subtitle">Browse available doctors and their specialisations at MedCare Plus.</p>
      
      <div className="grid-layout">
        {data.map((doc, idx) => (
          <div className="doctor-card" key={doc._id || idx}>
            <div className="doctor-name">{doc.name}</div>
            <div className="specialisation">{doc.specialisation}</div>
            <div>
              <span className={`availability-tag available-${Boolean(doc.available)}`}>
                {doc.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsPage;
