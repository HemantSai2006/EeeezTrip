import React from 'react';
import './ToggleRow.css';

export default function ToggleRow({ options, value, onChange, maxWidth }) {
  return (
    <div className="toggle-row" style={maxWidth ? { maxWidth } : {}}>
      {options.map(opt => (
        <button
          key={opt.value}
          className={`tgl${value === opt.value ? ' tgl--on' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
