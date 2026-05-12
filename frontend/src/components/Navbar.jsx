import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_ITEMS = [
  { id: 'home',      label: '🏠 Home' },
  { id: 'mood',      label: '🎭 Mood Planner' },
  { id: 'ai',        label: '🤖 AI Assistant' },
  { id: 'booking',   label: '🎟 Book Tickets' },
  { id: 'itinerary', label: '📅 Itinerary' },
  { id: 'tips',      label: '💡 Travel Tips' },
  { id: 'mytrips',   label: '🎒 My Trips' },
];

export default function Navbar() {
  const { currentPage, navigate } = useApp();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('login');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo" onClick={() => navigate('home')}>
        Eeez<em>trip</em>
      </div>
      <div className="navbar__links">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`navbar__btn${currentPage === item.id ? ' navbar__btn--active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="navbar__user">
        <button
          className="navbar__user-btn"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          👤 {currentUser?.fullName || currentUser?.email}
        </button>
        {showUserMenu && (
          <div className="navbar__user-menu">
            <div className="navbar__user-info">
              <p className="user-name">{currentUser?.fullName}</p>
              <p className="user-email">{currentUser?.email}</p>
            </div>
            <div className="navbar__user-divider" />
            <button
              className="navbar__user-logout"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
