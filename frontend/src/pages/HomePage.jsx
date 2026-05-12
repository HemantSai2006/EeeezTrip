import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransportCard from '../components/TransportCard';
import HotelCard from '../components/HotelCard';
import MapView from '../components/MapView';
import './HomePage.css';

const TRAVELLER_OPTIONS = [
  '1 Adult', '2 Adults', '2 Adults, 1 Child', 'Family (4+)', 'Group (6+)',
];

export default function HomePage() {
  const { setItinDest, setItinBudget, setItinDuration, setItinTravellers, navigate } = useApp();

  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  })();

  const [from,      setFrom]      = useState('Hyderabad');
  const [to,        setTo]        = useState('');
  const [date,      setDate]      = useState(defaultDate);
  const [duration,  setDuration]  = useState(3);
  const [traveller, setTraveller] = useState('2 Adults');
  const [exactBudget, setExactBudget] = useState('');
  const [results,   setResults]   = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSearch = async () => {
    if (!to.trim()) { alert('Please enter a destination!'); return; }
    if (!exactBudget.trim()) { alert('Please enter a budget!'); return; }
    if (!duration || duration < 1) { alert('Please enter a valid duration!'); return; }

    setItinDest(`${from} → ${to}`);
    setItinBudget(`₹${exactBudget}`);
    setItinDuration(duration);
    
    // Attempt to extract a number from traveller string
    const numTravellers = parseInt(traveller) || 1;
    setItinTravellers(numTravellers);

    setLoadingAI(true);
    setResults(null);

    try {
      const prompt = `Provide the best transport options, hotels, and food options to travel from ${from} to ${to} for ${traveller} for a duration of ${duration} days with a TOTAL combined budget of ₹${exactBudget} for the entire group (NOT per person).
Ensure that the combined total cost of Transport + (${duration} nights of Hotel) + (${duration} days of Food) strictly fits within the ₹${exactBudget} budget.
Return EXACTLY this JSON structure. Provide real realistic estimates. Do NOT include itineraries.
IMPORTANT RULES:
1. For 'transport', you MUST provide AT LEAST 3 different options, specifically 1 Flight, 1 Train, and 1 Bus (if available for this route) so the user has choices.
2. For 'food', provide AT LEAST 3-4 different restaurant or cafe options.
3. For the 'url' field, provide a real, accurate URL to a popular booking platform like MakeMyTrip, IRCTC, RedBus (for transport), Booking.com, Agoda (for hotels), or Zomato/TripAdvisor (for food).
{
  "transport": [
    { "name": "Flight/Train Name", "price": "₹... (Total)", "icon": "✈️", "meta": "Duration or info", "badgeLabel": "Fastest/Cheapest", "badge": "primary", "url": "https://www.makemytrip.com" },
    { "name": "Another Option", "price": "₹... (Total)", "icon": "🚂", "meta": "Duration or info", "badgeLabel": "Comfortable", "badge": "secondary", "url": "https://www.irctc.co.in" }
  ],
  "hotels": [
    { "name": "Specific Hotel Name", "price": "₹... (Total for ${duration} nights)", "icon": "🏨", "meta": "Location info", "stars": "⭐⭐⭐⭐", "rating": "4.5/5", "badgeLabel": "Top Choice", "badge": "primary", "bg": "#e2e8f0", "url": "https://www.booking.com" }
  ],
  "food": [
    { "name": "Specific Restaurant/Cafe Name", "price": "₹... (Est. Total Food Cost)", "icon": "🍽️", "meta": "Cuisine/Location", "badgeLabel": "Must Try", "badge": "primary", "url": "https://www.zomato.com" },
    { "name": "Another Cafe", "price": "₹... (Est. Total Food Cost)", "icon": "🍽️", "meta": "Cuisine/Location", "badgeLabel": "Local Fav", "badge": "secondary", "url": "https://www.zomato.com" }
  ]
}`;
      const token = sessionStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], expectJson: true })
      });
      const data = await response.json();
      
      if (data.success) {
        let replyStr = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonStr = replyStr.substring(replyStr.indexOf('{'), replyStr.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonStr);
        setResults({ from, to, traveller, duration, exactBudget, aiData: parsed });
        setTimeout(() => {
          document.getElementById('home-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        alert("AI Error: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch AI data.");
    }
    setLoadingAI(false);
  };

  return (
    <div className="page page-enter" id="pg-home">
      {/* HERO */}
      <div className="hero">
        <h1>Your dream trip,<br />planned by <span>AI ✨</span></h1>
        <p>Compare trains, flights & buses. Find the best hotels. Get day-wise itineraries and budgets — all in one place.</p>
        <div className="hero-pills">
          {['🚂 Train Booking', '✈️ Flights', '🚌 Bus', '🏨 Hotels', '🗺 Maps', '🤖 AI Planner'].map(p => (
            <span key={p} className="pill">{p}</span>
          ))}
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="card search-box">
        <div className="s-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div className="fld">
            <label>From</label>
            <input type="text" value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g. Hyderabad" />
          </div>
          <div className="fld">
            <label>To</label>
            <input type="text" value={to} onChange={e => setTo(e.target.value)} placeholder="e.g. Goa" />
          </div>
          <div className="fld">
            <label>Travel Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="fld">
            <label>Duration (Days)</label>
            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min="1" max="30" />
          </div>
          <div className="fld">
            <label>Travellers</label>
            <select value={traveller} onChange={e => setTraveller(e.target.value)}>
              {TRAVELLER_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="fld">
            <label>Total Budget (₹)</label>
            <input type="number" value={exactBudget} onChange={e => setExactBudget(e.target.value)} placeholder="e.g. 15000" />
          </div>
        </div>
        <button className="btn-go" onClick={handleSearch} disabled={loadingAI} style={{ marginTop: '20px' }}>
          {loadingAI ? '🤖 Fetching AI Recommendations...' : '🔍 Search & Plan with AI'}
        </button>
      </div>

      {/* RESULTS */}
      {results && results.aiData && (
        <div id="home-results">
          <h2 className="sec-title" style={{ marginBottom: '0.3rem' }}>
            AI Suggested <span>Transport Options</span>
          </h2>
          <p className="results-sub">
            {results.from} → {results.to} &nbsp;•&nbsp; {results.traveller} &nbsp;•&nbsp; {results.duration} Days &nbsp;•&nbsp; Budget: ₹{results.exactBudget}
          </p>
          <div className="t-grid">
            {results.aiData.transport?.map((t, i) => <TransportCard key={i} item={t} />)}
          </div>

          <h2 className="sec-title" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
            AI Recommended <span>Hotels in {results.to}</span>
          </h2>
          <div className="h-grid">
            {results.aiData.hotels?.map((h, i) => <HotelCard key={i} item={h} />)}
          </div>

          <h2 className="sec-title" style={{ marginBottom: '1rem', marginTop: '2rem' }}>
            AI Recommended <span>Restaurants & Food</span>
          </h2>
          <div className="t-grid">
            {results.aiData.food?.map((f, i) => <TransportCard key={i} item={f} />)}
          </div>

          <h2 className="sec-title" style={{ marginTop: '2rem' }}>📍 Places to <span>Explore in {results.to}</span></h2>
          <p className="results-sub" style={{ marginBottom: '1rem' }}>Hover over pins to explore top attractions</p>
          <MapView destination={results.to} />

          {/* AI CTA */}
          <div className="ai-cta">
            <div className="ai-cta__title">🤖 Get a full AI-planned itinerary for {results.to}</div>
            <p className="ai-cta__sub">Our AI will create a complete day-by-day trip plan with activities, food & budget just for you.</p>
            <div className="cta-btns">
              <button className="btn-go" style={{ width: 'auto', padding: '10px 22px', fontSize: 13 }} onClick={() => navigate('itinerary')}>📅 View Day-wise Itinerary</button>
              <button className="btn-outline" onClick={() => navigate('ai')}>🤖 Ask AI Assistant</button>
              <button className="btn-green" onClick={() => navigate('mood')}>🎭 Mood Trip Planner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
