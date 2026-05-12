import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const { navigate } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('eeeztrip_auth', JSON.stringify(data.user));
        sessionStorage.setItem('token', data.token);

        // Also clear any lingering localStorage auth
        localStorage.removeItem('eeeztrip_auth');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Server connection failed');
    }
    
    setLoading(false);
  };

  const goToLogin = () => {
    navigate('login');
  };

  return (
    <div className="auth-page" id="pg-register">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✈️</div>
            <h1>Eeeztrip</h1>
            <p className="auth-title">Create Account</p>
            <p className="auth-sub">Join millions exploring India</p>
          </div>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

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
                placeholder="At least 6 characters"
                disabled={loading}
              />
              <span className="field-hint">Minimum 6 characters</span>
            </div>

            <div className="form-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <button
            className="auth-btn auth-btn--secondary"
            onClick={goToLogin}
            disabled={loading}
          >
            Sign In
          </button>

          <div className="auth-terms">
            <p>By signing up, you agree to our Terms & Conditions</p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side__content">
            <div className="auth-side__icon">🎒</div>
            <h2>Your Travel Companion</h2>
            <p>Start your journey with Eeeztrip and discover the best travel deals, personalized itineraries, and expert travel tips.</p>
            <div className="auth-features">
              <div className="feature">
                <span>⚡</span>
                <span>Instant Bookings</span>
              </div>
              <div className="feature">
                <span>🎯</span>
                <span>Personalized Trips</span>
              </div>
              <div className="feature">
                <span>💬</span>
                <span>24/7 Support</span>
              </div>
              <div className="feature">
                <span>🌟</span>
                <span>Exclusive Offers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
