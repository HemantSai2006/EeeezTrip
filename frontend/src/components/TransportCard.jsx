import React from 'react';
import './TransportCard.css';

export default function TransportCard({ item }) {
  return (
    <div className={`transport-card${item.feat ? ' transport-card--featured' : ''}`}>
      <span className={`badge ${item.badge}`}>{item.badgeLabel}</span>
      <div className="transport-card__icon">{item.icon}</div>
      <div className="transport-card__name">{item.name}</div>
      <div className="transport-card__price">{item.price}</div>
      <div className="transport-card__meta">{item.meta}</div>
      <button
        className="btn-book"
        onClick={() => window.open(item.url, '_blank')}
      >
        Book Now →
      </button>
    </div>
  );
}
