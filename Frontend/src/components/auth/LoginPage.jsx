// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

function LoginPage({ onForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/login';
      const response = await axios.post(API_URL, { email, password });

      const { token, sponsor, user } = response.data;

      // Save token with consistent key
      localStorage.setItem('authToken', token);


      // Redirect based on role
      const role = sponsor?.role || user?.role;
      const userId = sponsor?.sponsor_id || user?.user_id;

      if (role === 'volunteer') {
        navigate(`/volunteer/${userId}/dashboard`);
      } else if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'sponsor') {
        navigate('/sponsor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) {
        setError(err.response.data.message || 'Invalid email or password.');
      } else if (err.request) {
        setError('Cannot connect to the server.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>

        <p className="forgot-password">
          <a
            href="#"
            className="link-btn"
            onClick={(e) => {
              e.preventDefault();
              if (onForgotPassword) onForgotPassword();
            }}
          >
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
