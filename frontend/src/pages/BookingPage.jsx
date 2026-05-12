import React, { useState } from 'react';
import TransportCard from '../components/TransportCard';
import HotelCard from '../components/HotelCard';
import { TRANSPORT, HOTELS } from '../data/travelData';
import './BookingPage.css';

const API_URL = '';


const TABS = [
  { id: 'train', label: 'Train', icon: '🚆' },
  { id: 'flight', label: 'Airplane', icon: '✈️' },
  { id: 'bus', label: 'Bus', icon: '🚌' },
  { id: 'hotel', label: 'Hotel', icon: '🏨' },
];

const PASSENGERS = ['1 Adult', '2 Adults', '2 Adults, 1 Child', 'Family (4+)'];
const TRAVEL_CLASS = ['Sleeper', 'AC 3-Tier', 'AC 2-Tier', '1AC', 'Economy', 'Business'];
const ROOM_OPTIONS = ['1 Room', '2 Rooms', '3 Rooms'];
const TRIP_TYPES = ['oneway', 'roundtrip'];

const formatDate = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const transportOptions = {
  train: [
    ...TRANSPORT.budget.filter(item => item.name.toLowerCase().includes('train')),
    ...TRANSPORT.luxury.filter(item => item.name.toLowerCase().includes('train')),
  ],
  flight: [
    ...TRANSPORT.budget.filter(item => item.name.toLowerCase().includes('flight') || item.name.toLowerCase().includes('air')),
    ...TRANSPORT.luxury.filter(item => item.name.toLowerCase().includes('flight') || item.name.toLowerCase().includes('air')),
  ],
  bus: [
    ...TRANSPORT.budget.filter(item => item.name.toLowerCase().includes('bus')),
    ...TRANSPORT.luxury.filter(item => item.name.toLowerCase().includes('bus')),
  ],
};

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState('train');
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState('Hyderabad');
  const [to, setTo] = useState('Goa');
  const [departDate, setDepartDate] = useState(formatDate(10));
  const [returnDate, setReturnDate] = useState(formatDate(17));
  const [checkIn, setCheckIn] = useState(formatDate(10));
  const [checkOut, setCheckOut] = useState(formatDate(13));
  const [passengers, setPassengers] = useState(PASSENGERS[0]);
  const [travelClass, setTravelClass] = useState(TRAVEL_CLASS[0]);
  const [rooms, setRooms] = useState(ROOM_OPTIONS[0]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveFlights, setLiveFlights] = useState([]);
  const [liveTrains, setLiveTrains] = useState([]);
  const [liveBuses, setLiveBuses] = useState([]);
  const [liveHotels, setLiveHotels] = useState([]);

  const handleSearch = async () => {
    if (!to.trim()) {
      alert('Please enter a destination city.');
      return;
    }

    setResults({
      tab: activeTab,
      from: activeTab === 'hotel' ? '' : from,
      to,
      departDate,
      returnDate,
      checkIn,
      checkOut,
      tripType,
      passengers,
      travelClass,
      rooms,
    });

    if (activeTab === 'flight') {
      fetchLiveFlights();
    } else if (activeTab === 'train') {
      fetchLiveTrains();
    } else if (activeTab === 'bus') {
      fetchLiveBuses();
    } else if (activeTab === 'hotel') {
      fetchLiveHotels();
    } else {
      setTimeout(() => {
        document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const fetchLiveTrains = async () => {
    setLoading(true);
    setLiveTrains([]);
    try {
      const url = `${API_URL}/api/trains/search?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&date=${departDate}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.trains) {
        setLiveTrains(data.trains);
        if (data.subscriptionWarning) {
          console.warn("Using simulated train data. Subscribe to IRCTC1 on RapidAPI for live real data.");
        }
      } else {
        alert(data.error || 'No trains found for this route.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the Train API server.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const fetchLiveFlights = async () => {
    setLoading(true);
    setLiveFlights([]);
    try {
      // Example: http://localhost:5000/api/flights/search?origin=LHR&destination=JFK&date=2026-06-15
      const url = `${API_URL}/api/flights/search?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&date=${departDate}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.flights) {
        setLiveFlights(data.flights);
      } else {
        alert(data.error || 'No flights found for this route.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the Flight API server.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const fetchLiveBuses = async () => {
    setLoading(true);
    setLiveBuses([]);
    try {
      const url = `${API_URL}/api/buses/search?origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&date=${departDate}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.buses) {
        setLiveBuses(data.buses);
        if (data.isSimulated) {
          console.log("Loaded generated bus schedules.");
        }
      } else {
        alert(data.error || 'No buses found for this route.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the Bus API server.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const fetchLiveHotels = async () => {
    setLoading(true);
    setLiveHotels([]);
    try {
      const parsedAdults = parseInt(passengers.split(' ')[0]) || 1;
      const parsedRooms = parseInt(rooms.split(' ')[0]) || 1;
      
      const url = `${API_URL}/api/hotels/search?destination=${encodeURIComponent(to)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${parsedAdults}&rooms=${parsedRooms}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.hotels) {
        setLiveHotels(data.hotels);
        if (data.isSimulated) {
          console.log("Loaded generated hotel inventory.");
        }
      } else {
        alert(data.error || 'No hotels found for this destination.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to the Hotel API server.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.getElementById('booking-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const selectedOptions = activeTab === 'hotel'
    ? HOTELS.budget.concat(HOTELS.luxury)
    : transportOptions[activeTab] || [];

  return (
    <div className="page page-enter booking-page" id="pg-booking">
      <div className="booking-top card">
        <div className="booking-head">
          <div>
            <p className="booking-small">Book Your Journey</p>
            <h2>Compare prices across all transport options and hotels</h2>
            <p className="booking-copy">Search train, bus, flight, or hotel availability with source, destination and date fields. Choose your category and book directly from trusted providers.</p>
          </div>
          <div className="booking-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`booking-tab${activeTab === tab.id ? ' booking-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="booking-form card booking-form--flat">
          {activeTab !== 'hotel' ? (
            <div className="form-grid">
              <div className="form-group">
                <label>From</label>
                <input value={from} onChange={e => setFrom(e.target.value)} placeholder="Source city" />
              </div>
              <div className="form-group">
                <label>To</label>
                <input value={to} onChange={e => setTo(e.target.value)} placeholder="Destination city" />
              </div>
              <div className="form-group">
                <label>Departure</label>
                <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} />
              </div>
              {tripType === 'roundtrip' && (
                <div className="form-group">
                  <label>Return</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label>Passengers</label>
                <select value={passengers} onChange={e => setPassengers(e.target.value)}>
                  {PASSENGERS.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Class / Category</label>
                <select value={travelClass} onChange={e => setTravelClass(e.target.value)}>
                  {TRAVEL_CLASS.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="form-grid">
              <div className="form-group">
                <label>Destination</label>
                <input value={to} onChange={e => setTo(e.target.value)} placeholder="City or hotel area" />
              </div>
              <div className="form-group">
                <label>Check-in</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Check-out</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Rooms</label>
                <select value={rooms} onChange={e => setRooms(e.target.value)}>
                  {ROOM_OPTIONS.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Guests</label>
                <select value={passengers} onChange={e => setPassengers(e.target.value)}>
                  {PASSENGERS.map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
          )}

          {activeTab !== 'hotel' && (
            <div className="trip-type-row">
              {TRIP_TYPES.map(type => (
                <button
                  key={type}
                  className={`trip-type${tripType === type ? ' trip-type--active' : ''}`}
                  onClick={() => setTripType(type)}
                >
                  {type === 'oneway' ? 'One Way' : 'Round Trip'}
                </button>
              ))}
            </div>
          )}

          <button className="btn-booking" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching Live API...' : `Search ${activeTab === 'hotel' ? 'Hotels' : 'Tickets'}`}
          </button>
        </div>
      </div>

      <div className="booking-results" id="booking-results">
        <div className="booking-results__header">
          <div>
            <h3>{results ? `${activeTab === 'hotel' ? 'Hotel' : activeTab === 'flight' ? 'Flight' : activeTab === 'bus' ? 'Bus' : 'Train'} Availability` : 'Ready to search?'}</h3>
            <p>{results
              ? activeTab === 'hotel'
                ? `Showing hotels in ${results.to} for ${results.rooms} from ${results.checkIn} to ${results.checkOut}`
                : `Showing ${results.tab} options from ${results.from} to ${results.to} on ${results.departDate}`
              : 'Use the search form above to compare fares and hotel availability without AI.'
            }</p>
          </div>
        </div>

        <div className="booking-grid">
          {loading ? (
             <div className="loading-spinner" style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                <p>Loading real-time data from API...</p>
             </div>
          ) : activeTab === 'train' && results ? (
             liveTrains.length > 0 ? (
               liveTrains.map((train, index) => (
                 <TransportCard key={train.id} item={{
                   feat: index === 0,
                   icon: '🚂',
                   badge: index === 0 ? 'b-best' : 'b-fast',
                   badgeLabel: index === 0 ? '⭐ Best Option' : '⚡ Live',
                   name: train.name,
                   price: `₹${train.price}`,
                   meta: `${train.duration} • Departure: ${train.departureTime} • ${train.class}`,
                   url: 'https://www.irctc.co.in'
                 }} />
               ))
             ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No live trains found for this route.</p>
             )
          ) : activeTab === 'bus' && results ? (
             liveBuses.length > 0 ? (
               liveBuses.map((bus, index) => (
                 <TransportCard key={bus.id} item={{
                   feat: index === 0,
                   icon: '🚌',
                   badge: index === 0 ? 'b-best' : 'b-fast',
                   badgeLabel: index === 0 ? '⭐ Top Rated' : '⚡ Live',
                   name: `${bus.name} - ${bus.type}`,
                   price: `₹${bus.price}`,
                   meta: `${bus.duration} • Departure: ${bus.departureTime} • ⭐ ${bus.rating}/5.0 (${bus.availableSeats} Seats left)`,
                   url: 'https://www.redbus.in'
                 }} />
               ))
             ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No live buses found for this route.</p>
             )
          ) : activeTab === 'flight' && results ? (
             liveFlights.length > 0 ? (
               liveFlights.map((flight, index) => (
                 <div key={flight.id} className="card transport-card">
                    <div className="transport-card__header">
                      <div className="transport-logo">
                         <img src={flight.airlineLogo} alt={flight.airline} style={{ width: '40px', height: '40px', objectFit: 'contain' }}/>
                         <div>
                            <h4>{flight.airline}</h4>
                            <span className="transport-type">Flight • {flight.stopCount === 0 ? 'Direct' : `${flight.stopCount} Stop(s)`}</span>
                         </div>
                      </div>
                      <div className="transport-price">{flight.price}</div>
                    </div>
                    <div className="transport-card__route">
                       <div className="route-point">
                          <span className="time">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="station">{flight.originDisplayCode}</span>
                       </div>
                       <div className="route-duration">
                          <span className="duration-line"></span>
                          <span className="duration-text">{Math.floor(flight.durationInMinutes / 60)}h {flight.durationInMinutes % 60}m</span>
                       </div>
                       <div className="route-point">
                          <span className="time">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="station">{flight.destinationDisplayCode}</span>
                       </div>
                    </div>
                    <button className="btn-book" onClick={() => window.open(`https://www.skyscanner.co.in/transport/flights/${flight.originDisplayCode.toLowerCase()}/${flight.destinationDisplayCode.toLowerCase()}/${flight.departureTime.split('T')[0].replace(/-/g, '').substring(2)}/`, '_blank')}>Book Flight</button>
                 </div>
               ))
             ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No live flights found for this route.</p>
             )
          ) : activeTab === 'hotel' && results ? (
             liveHotels.length > 0 ? (
               liveHotels.map((hotel, index) => (
                 <HotelCard key={hotel.id} item={{
                   feat: index === 0,
                   badge: index === 0 ? 'b-best' : 'b-fast',
                   badgeLabel: index === 0 ? 'Best Value' : 'Popular',
                   name: hotel.name,
                   location: to,
                   rating: hotel.rating,
                   reviews: hotel.reviews,
                   price: `₹${hotel.price}`,
                   image: hotel.image,
                   url: 'https://www.booking.com'
                 }} />
               ))
             ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No live hotels found for this destination.</p>
             )
          ) : (
             selectedOptions.slice(0, 6).map((item, index) => (
               activeTab === 'hotel'
                 ? <HotelCard key={`hotel-${index}`} item={item} />
                 : <TransportCard key={`${activeTab}-${index}`} item={item} />
             ))
          )}
        </div>
      </div>
    </div>
  );
}
