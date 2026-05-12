import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOODS } from '../data/travelData';
import './MoodPage.css';

export default function MoodPage() {
  const { setItinDest, setItinBudget, setItinDuration, setItinTravellers, navigate } = useApp();
  const [selectedMood, setSelectedMood] = useState('');
  const [duration, setDuration]         = useState(3);
  const [travellers, setTravellers]     = useState(2);
  const [exactBudget, setExactBudget]   = useState(15000);
  const [result, setResult]             = useState(null);
  const [selectedDest, setSelectedDest] = useState('');

  const handlePlan = () => {
    if (!selectedMood) { alert('Please select a mood first!'); return; }
    if (!exactBudget || exactBudget < 500) { alert('Please enter a valid budget!'); return; }
    
    setResult({ mood: selectedMood, duration, exactBudget, travellers });
    setSelectedDest(''); // Reset selected destination on new search
    setTimeout(() => {
      document.getElementById('mood-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const moodData = result ? MOODS[result.mood] : null;

  return (
    <div className="page page-enter" id="pg-mood">
      <h2 className="sec-title" style={{ marginBottom: '0.4rem' }}>
        🎭 Mood-Based <span>Trip Planner</span>
      </h2>
      <p className="page-sub">Tell us your vibe — we'll plan the perfect trip for your mood.</p>

      {/* MOOD GRID */}
      <div className="mood-grid">
        {Object.entries(MOODS).map(([key, m]) => (
          <div
            key={key}
            className={`mood-card${selectedMood === key ? ' mood-card--on' : ''}`}
            onClick={() => setSelectedMood(key)}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <div className="mood-label">{m.label}</div>
            <div className="mood-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 320, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Duration (Days):</label>
        <input 
          type="number" 
          min="1" max="30" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} 
        />
      </div>

      <div style={{ maxWidth: 320, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>No. of Travellers:</label>
        <input 
          type="number" 
          min="1" max="20" 
          value={travellers} 
          onChange={(e) => setTravellers(e.target.value)} 
          style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} 
        />
      </div>

      <div style={{ maxWidth: 320, margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Max Budget (₹):</label>
        <input 
          type="number" 
          min="500" step="500"
          value={exactBudget} 
          onChange={(e) => setExactBudget(e.target.value)} 
          style={{ width: 120, padding: '8px 12px', borderRadius: 8, border: '1.5px solid var(--border)', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} 
        />
      </div>

      <button className="btn-go" style={{ maxWidth: 320 }} onClick={handlePlan}>
        ✨ Show Recommendations
      </button>

      {/* RESULT */}
      {result && moodData && (
        <div id="mood-result" className="mood-result">
          <div className="mood-result__head">{moodData.title}</div>
          <div className="mood-stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="mood-stat">
              <div className="mood-stat__label">Target Budget</div>
              <div className="mood-stat__value" style={{ fontSize: 15 }}>
                ₹{Number(result.exactBudget).toLocaleString()}
              </div>
              <div className="mood-stat__sub">total budget</div>
            </div>
            <div className="mood-stat">
              <div className="mood-stat__label">Duration</div>
              <div className="mood-stat__value" style={{ fontSize: 15 }}>{result.duration} Days</div>
              <div className="mood-stat__sub">trip length</div>
            </div>
            <div className="mood-stat">
              <div className="mood-stat__label">Travellers</div>
              <div className="mood-stat__value" style={{ fontSize: 15 }}>{result.travellers}</div>
              <div className="mood-stat__sub">total people</div>
            </div>
          </div>

          <div className="info-row">
            <strong>📍 Must-visit places in general:</strong><br />{moodData.places}
          </div>
          <div className="info-row" style={{ marginTop: 8 }}>
            <strong>🏨 Typical stays:</strong><br />
            <span style={{ color: 'var(--muted)' }}>
              {moodData.budgetHotels} / {moodData.luxuryHotels}
            </span>
          </div>

          <div className="info-row" style={{ marginTop: 20, padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <strong style={{ fontSize: '14px', color: 'var(--brand)' }}>🎯 Select a destination to plan your trip:</strong>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              {moodData.destinations.map(d => (
                <div 
                  key={d}
                  onClick={() => setSelectedDest(d)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: `1.5px solid ${selectedDest === d ? 'var(--brand2)' : 'var(--border)'}`,
                    background: selectedDest === d ? '#eff6ff' : '#fff',
                    color: selectedDest === d ? 'var(--brand2)' : 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: selectedDest === d ? '0 2px 8px rgba(37,99,235,0.15)' : 'none'
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            
            <div className="cta-btns" style={{ marginTop: 16 }}>
              <button
                className="btn-go"
                style={{ width: '100%', padding: '12px 22px', fontSize: 14, opacity: selectedDest ? 1 : 0.5 }}
                disabled={!selectedDest}
                onClick={() => {
                  setItinDest(selectedDest);
                  setItinBudget(`₹${Number(result.exactBudget).toLocaleString()}`);
                  setItinDuration(result.duration);
                  setItinTravellers(result.travellers);
                  navigate('itinerary');
                }}
              >
                📅 {selectedDest ? `Generate Day-wise Itinerary for ${selectedDest}` : 'Select a destination first'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
