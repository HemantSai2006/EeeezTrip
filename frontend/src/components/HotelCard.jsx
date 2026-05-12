import React from 'react';
import './HotelCard.css';

export default function HotelCard({ item }) {
  return (
    <div className="hotel-card">
      <div className="hotel-card__img" style={{ background: item.bg }}>
        <span>{item.icon}</span>
      </div>
      <div className="hotel-card__body">
        <span className={`badge ${item.badge}`}>{item.badgeLabel}</span>
        <div className="hotel-card__name">{item.name}</div>
        <div className="hotel-card__stars">
          {item.stars} <span>{item.rating}</span>
        </div>
        <div className="hotel-card__price">
          {item.price}<small>/night</small>
        </div>
        <div className="hotel-card__meta">{item.meta}</div>
        <button
          className="btn-book"
          style={{ marginTop: 10 }}
          onClick={() => window.open(item.url, '_blank')}
        >
          Book Hotel →
        </button>
      </div>
    </div>
  );
}
