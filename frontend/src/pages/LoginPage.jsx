import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  setError('');
  setLoading(true);

  try {

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.success) {

  // Save backend auth
  sessionStorage.setItem('eeeztrip_auth', JSON.stringify(data.user));

  sessionStorage.setItem('token', data.token);

  // Also clear any lingering localStorage auth so it doesn't conflict
  localStorage.removeItem('eeeztrip_auth');
  localStorage.removeItem('token');

  window.location.reload();

} else {
      setError(data.message);
    }

  } catch (error) {

    console.error(error);

    setError('Server connection failed');

  }

  setLoading(false);
};

  const goToRegister = () => {
    navigate('register');
  };

  return (
    <div className="auth-page" id="pg-login">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✈️</div>
            <h1>Eeeztrip</h1>
            <p className="auth-title">Welcome Back</p>
            <p className="auth-sub">Sign in to continue your travel journey</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <button
            className="auth-btn auth-btn--secondary"
            onClick={goToRegister}
            disabled={loading}
          >
            Create Account
          </button>

          <div className="auth-demo">
            <p className="auth-demo__label">Demo Account:</p>
            <p className="auth-demo__cred">Email: demo@eeeztrip.com</p>
            <p className="auth-demo__cred">Password: demo123</p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side__content">
            <div className="auth-side__icon">🌍</div>
            <h2>Explore the World</h2>
            <p>Book trains, flights, buses and hotels all in one place. Get AI-powered itineraries and travel tips for your next adventure.</p>
            <div className="auth-features">
              <div className="feature">
                <span>🚂</span>
                <span>Easy Transport Booking</span>
              </div>
              <div className="feature">
                <span>🏨</span>
                <span>Best Hotel Deals</span>
              </div>
              <div className="feature">
                <span>🤖</span>
                <span>AI Travel Planning</span>
              </div>
              <div className="feature">
                <span>💰</span>
                <span>Budget Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
