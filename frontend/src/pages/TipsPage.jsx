import React from 'react';
import { TRAVEL_TIPS } from '../data/travelData';
import './TipsPage.css';

export default function TipsPage() {
  return (
    <div className="page page-enter" id="pg-tips">
      <h2 className="sec-title" style={{ marginBottom: '0.4rem' }}>
        💡 Smart <span>Travel Tips</span>
      </h2>
      <p className="page-sub">Save money, travel smarter, stay safe — expert tips for Indian travellers.</p>

      <div className="tips-grid">
        {TRAVEL_TIPS.map((tip, i) => (
          <div key={i} className="tip-card">
            <div className="tip-card__icon">{tip.icon}</div>
            <div className="tip-card__title">{tip.title}</div>
            <div className="tip-card__text">{tip.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
