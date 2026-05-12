import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './ItineraryPage.css';

const FALLBACK_DAYS = [
  {
    title: '📅 Day 1 — Arrival & Beach Evening',
    cost: '~₹1,800',
    imageKeyword: 'beach',
    items: [
      { time: '07:30', title: 'Depart', desc: 'Board train. Quick breakfast.' },
      { time: '18:00', title: 'Arrive', desc: 'Take auto to hotel. Check in.' },
      { time: '19:30', title: 'Sunset 🌅', desc: 'Watch sunset, enjoy shacks.' },
    ],
  },
  {
    title: '📅 Day 2 — Sightseeing & Market',
    cost: '~₹1,400',
    imageKeyword: 'market',
    items: [
      { time: '10:00', title: 'Sightseeing ⛪', desc: 'Visit popular local spots.' },
      { time: '13:00', title: 'Lunch 🐟', desc: 'Authentic local food.' },
      { time: '15:00', title: 'Flea Market 🛍', desc: 'Souvenirs, clothes, local craft.' },
    ],
  },
];

const FALLBACK_TIPS = [
  "Book your transport tickets well in advance.",
  "Always compare hotel prices on multiple platforms.",
  "Carry enough cash as ATMs might be scarce in remote areas."
];

export default function ItineraryPage() {
  const { 
    itinDest, itinBudget, itinDuration, itinTravellers,
    itinData, setItinData, lastGeneratedKey, setLastGeneratedKey
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateItinerary = async (forceRegen = false) => {
    setLoading(true);
    setError('');
    try {
      const prompt = `Create a highly detailed ${itinDuration}-day travel itinerary for ${itinDest} for ${itinTravellers} travellers with a total budget of ${itinBudget}.
Use this exact JSON structure:
{
  "isPossible": true,
  "rejectionMessage": "",
  "days": [
    {
      "title": "Day 1 - Arrival & Beach",
      "cost": "₹1500",
      "items": [
        { "time": "09:00", "title": "Breakfast at Authentic Cafe", "location": "REAL Specific Restaurant Name, City", "desc": "Detailed description..." },
        { "time": "11:00", "title": "Activity Name", "location": "REAL Specific Map Location or Hotel Name, City", "desc": "Very detailed description including travel tips and costs." }
      ]
    }
  ],
  "tips": ["Important Tip 1", "Important Tip 2", "Important Tip 3"],
  "totalBudget": "₹8500",
  "buffer": "₹2000"
}
IMPORTANT: For every single activity, you MUST provide a REAL, specific, searchable location name.
BUDGET CHECK: You must act as a strict, realistic travel agent. If the total budget provided (e.g. ₹500 for 3 days for 2 people) is fundamentally unrealistic, unsafe, or mathematically impossible for ANY form of travel or accommodation, do NOT invent absurd workarounds like 'pack 3 days of food'. Instead:
1. Set "isPossible": false.
2. Provide a polite but realistic "rejectionMessage" explaining exactly why the budget is insufficient for this duration and group size, and how much they would realistically need to save to make it happen.
3. Leave "days" and "tips" as empty arrays.`;

      const token = sessionStorage.getItem('token');
      if (!token) throw new Error("Not logged in");

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          expectJson: true
        })
      });

      const data = await response.json();
      if (data.success) {
        let replyStr = data.reply;
        // Clean up potential markdown blocks if AI ignored the instruction
        replyStr = replyStr.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const startIndex = replyStr.indexOf('{');
        const endIndex = replyStr.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
          const jsonStr = replyStr.substring(startIndex, endIndex + 1);
          try {
            const parsed = JSON.parse(jsonStr);
            setItinData(parsed);
            setLastGeneratedKey(`${itinDest}-${itinBudget}-${itinDuration}-${itinTravellers}`);
          } catch (parseErr) {
            console.error("JSON Parse Error:", parseErr, "Raw String:", jsonStr);
            throw new Error("AI returned malformed JSON");
          }
        } else {
          throw new Error("Invalid JSON format from AI");
        }
      } else {
        throw new Error(data.message || 'Failed to generate plan.');
      }
    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${err.message}. Showing fallback sample data.`);
      setItinData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only generate if we have a specific destination set from Mood Planner
    if (itinDest && itinDest !== 'Hyderabad → Goa') {
      const currentKey = `${itinDest}-${itinBudget}-${itinDuration}-${itinTravellers}`;
      if (!itinData || lastGeneratedKey !== currentKey) {
        generateItinerary();
      }
    }
  }, [itinDest, itinBudget, itinDuration, itinTravellers]);

  const daysToRender = itinData?.days || FALLBACK_DAYS;
  const tipsToRender = itinData?.tips || FALLBACK_TIPS;
  const totalBudgetRender = itinData?.totalBudget || itinBudget;
  const bufferRender = itinData?.buffer || '₹2000';

  return (
    <div className="page page-enter" id="pg-itinerary">
      <h2 className="sec-title" style={{ marginBottom: '0.4rem' }}>
        📅 Day-wise <span>Itinerary</span>
      </h2>

      {/* CONTROLS */}
      <div className="card itin-controls">
        <div className="itin-control-item">
          <div className="itin-control__label">Destination</div>
          <div className="itin-control__value">{itinDest}</div>
        </div>
        <div className="itin-control-item">
          <div className="itin-control__label">Target Budget</div>
          <div className="itin-control__value" style={{ color: 'var(--brand)' }}>{itinBudget}</div>
        </div>
        <div className="itin-control-item">
          <div className="itin-control__label">Duration</div>
          <div className="itin-control__value">{itinDuration} Days</div>
        </div>
        <div className="itin-control-item">
          <div className="itin-control__label">Travellers</div>
          <div className="itin-control__value">{itinTravellers} People</div>
        </div>
        <button className="btn-outline" onClick={() => generateItinerary(true)} disabled={loading}>
          {loading ? '🤖 Generating...' : '🤖 Regenerate AI Plan'}
        </button>
      </div>

      {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--brand)' }}>
          <h3>🤖 AI is crafting your perfect itinerary...</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Please wait a few seconds</p>
        </div>
      ) : (
        <>
          {itinData && itinData.isPossible === false ? (
            <div className="budget-box" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', marginTop: '20px' }}>
              <div className="budget-box__title" style={{ color: '#991b1b', fontSize: '18px' }}>🚫 Budget Insufficient</div>
              <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.6' }}>{itinData.rejectionMessage}</p>
            </div>
          ) : (
            <>
              {/* DAY CARDS */}
              {daysToRender.map((day, di) => (
                <div key={di} className="itin-card">
              <div className="itin-card__hdr">
                <span className="itin-card__title">{day.title}</span>
                <span className="itin-card__cost">{day.cost}</span>
              </div>
              <div className="itin-card__body">
                {day.items.map((item, ii) => (
                  <div key={ii} className="itin-item">
                    <div className="itin-time">{item.time}</div>
                    <div className="itin-dot" />
                    <div className="itin-content" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                        <h5 style={{ flex: 1, margin: 0 }}>{item.title}</h5>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location || item.title + ' ' + itinDest)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: '11px', 
                            color: 'var(--brand)', 
                            textDecoration: 'none', 
                            background: '#eff6ff', 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          📍 View on Map
                        </a>
                      </div>
                      <p style={{ marginTop: '4px' }}>{item.desc}</p>
                      {item.location && <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px', fontStyle: 'italic' }}>📍 {item.location}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* TIPS BOX */}
          <div className="budget-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div className="budget-box__title">💡 Essential Travel Tips for {itinDest}</div>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', fontSize: '13px', color: 'var(--text)', lineHeight: '1.6' }}>
              {tipsToRender.map((tip, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* BUDGET SUMMARY */}
          <div className="budget-box">
            <div className="budget-box__title">💰 Total Estimated Budget</div>
            <div className="budget-box__sub">Total estimate for {itinTravellers} people for {itinDuration} days to {itinDest}</div>
            <div className="budget-box__total" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
              ✅ Total: {totalBudgetRender} &nbsp;|&nbsp;
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
                Add {bufferRender} buffer for comfort
              </span>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              className="btn-go" 
              onClick={async () => {
                const token = sessionStorage.getItem('token');
                if (!token) {
                  alert('Please login to save your trip!');
                  return;
                }
                try {
                  const res = await fetch('/api/trips', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      destination: itinDest,
                      budget: itinBudget,
                      duration: itinDuration,
                      travellers: itinTravellers,
                      itineraryData: itinData
                    })
                  });
                  const data = await res.json();
                  if (data.success) {
                    alert('Trip saved successfully! You can view it in your My Trips dashboard.');
                  } else {
                    alert('Error saving trip: ' + data.message);
                  }
                } catch (e) {
                  console.error(e);
                  alert('Failed to save trip.');
                }
              }}
            >
              💾 Save this Trip
            </button>
          </div>
          </>
        )}
        </>
      )}
    </div>
  );
}
