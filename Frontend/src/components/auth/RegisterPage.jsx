// src/components/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './RegisterPage.css';

function RegisterPage({ selectedRole = 'sponsor', openPanel }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-set role when modal opens (from HomePage)
  useEffect(() => {
    if (selectedRole) {
      setRole(selectedRole);
    }
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const API_URL = 'http://localhost:5000/api/auth/register';
      const payload = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase()
      };

      const response = await axios.post(API_URL, payload);

      setSuccess('Registration successful! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');

      if (openPanel) {
        setTimeout(() => openPanel('login'), 1000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || JSON.stringify(err.response.data));
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
    <div className="register-container">
      <h1>Register</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group password-group">
          <label>Password:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter password"
            />
            <span className="password-toggle" onClick={() => setShowPassword(prev => !prev)}>
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>

        <div className="form-group password-group">
          <label>Confirm Password:</label>
          <div className="password-wrapper">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select Role</option>
            <option value="parent">Parent</option>
            <option value="sponsor">Sponsor</option>
            <option value="volunteer">Volunteer</option>
            <option value="case_reporter">Case Reporter</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        Already have an account?{" "}
        <span style={{ color: "#ff8c00", cursor: "pointer" }} onClick={() => openPanel && openPanel('login')}>
          Login here
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;
