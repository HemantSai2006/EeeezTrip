import React from 'react';
import { MAP_PINS } from '../data/travelData';
import './MapView.css';

export default function MapView({ destination }) {
  return (
    <div className="map-wrap">
      <div className="map-grid" />
      <div className="map-road map-road--h" style={{ top: '40%' }} />
      <div className="map-road map-road--h" style={{ top: '65%' }} />
      <div className="map-road map-road--v" style={{ left: '35%' }} />
      <div className="map-road map-road--v" style={{ left: '62%' }} />

      {MAP_PINS.map((pin) => (
        <a
          key={pin.name}
          href={`https://maps.google.com/?q=${encodeURIComponent(pin.name + ' ' + destination)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="map-pin"
          style={{ top: pin.top, left: pin.left, textDecoration: 'none', color: 'inherit' }}
          title={pin.name}
        >
          <div className="map-pin__icon">{pin.icon}</div>
          <div className="map-pin__label">{pin.name}</div>
        </a>
      ))}

      <div className="map-bar">
        <span>📍 <strong>{destination}</strong> — Interactive attractions map</span>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noreferrer"
        >
          Open in Google Maps ↗
        </a>
      </div>
    </div>
  );
}
