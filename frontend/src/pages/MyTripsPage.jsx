import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './ItineraryPage.css';

export default function MyTripsPage() {
  const { navigate } = useApp();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your trips.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/trips', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setTrips(data.trips);
        } else {
          setError(data.message || 'Failed to fetch trips');
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching trips.');
      }
      setLoading(false);
    };

    fetchTrips();
  }, []);

  if (selectedTrip) {
    const { destination, budget, duration, travellers, itineraryData } = selectedTrip;
    
    return (
      <div className="page page-enter" id="pg-mytrips-detail" style={{ paddingBottom: '100px' }}>
        <button 
          className="btn-outline" 
          onClick={() => setSelectedTrip(null)}
          style={{ marginBottom: '20px' }}
        >
          ← Back to My Trips
        </button>

        <h1 className="page-title">Trip to <span>{destination}</span></h1>
        <p className="page-sub">
          {duration} Days &nbsp;•&nbsp; {travellers} Travellers &nbsp;•&nbsp; Budget: {budget}
        </p>

        {itineraryData?.isPossible === false ? (
          <div className="budget-box" style={{ background: '#fef2f2', border: '1px solid #fca5a5' }}>
            <div className="budget-box__title" style={{ color: '#991b1b' }}>⚠️ Budget Too Low</div>
            <p style={{ color: '#7f1d1d', marginTop: '10px' }}>{itineraryData.rejectionMessage}</p>
          </div>
        ) : (
          <div className="timeline">
            {itineraryData?.days?.map((day, idx) => (
              <div className="day-card" key={idx}>
                <div className="day-card__header">Day {day.day}: {day.theme}</div>
                <div className="day-card__body">
                  {day.activities.map((item, i) => (
                    <div className="activity" key={i}>
                      <div className="activity__time">{item.time}</div>
                      <div className="activity__info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text)' }}>
                            {item.activity}
                          </h4>
                          {item.location && (
                            <a 
                              href={`https://maps.google.com/?q=${encodeURIComponent(item.location + ' ' + destination)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '11px', color: 'var(--brand)', textDecoration: 'none', 
                                background: '#eff6ff', padding: '4px 8px', borderRadius: '12px', 
                                fontWeight: 600, whiteSpace: 'nowrap'
                              }}
                            >
                              📍 View Map
                            </a>
                          )}
                        </div>
                        <p style={{ marginTop: '4px' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page page-enter" id="pg-mytrips">
      <h1 className="page-title">🎒 My <span>Saved Trips</span></h1>
      <p className="page-sub">All your AI-planned itineraries securely saved in one place.</p>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading trips...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', background: '#f8fafc', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>No trips saved yet!</h3>
          <p style={{ color: 'var(--muted)', marginTop: '10px', marginBottom: '20px' }}>Go to the home page or itinerary planner to create and save your first trip.</p>
          <button className="btn-go" onClick={() => navigate('home')}>Plan a Trip</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
          {trips.map(trip => (
            <div key={trip._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: 'var(--text)' }}>{trip.destination}</h3>
                <span className="badge badge-primary">{trip.duration} Days</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                👥 {trip.travellers} Travellers
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                💰 Budget: {trip.budget}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '12px', margin: 0, marginTop: 'auto' }}>
                Saved on: {new Date(trip.createdAt).toLocaleDateString()}
              </p>
              <button 
                className="btn-outline" 
                style={{ marginTop: '10px', width: '100%' }}
                onClick={() => setSelectedTrip(trip)}
              >
                View Full Itinerary
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
