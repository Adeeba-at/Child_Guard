// src/components/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage({ selectedRole = 'sponsor' }) {  // ← RECEIVE role from HomePage
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // ← will be set from selectedRole
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-set role when modal opens (from HomePage)
  useEffect(() => {
    if (selectedRole) {
      setRole(selectedRole);
    }
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/register';

      const payload = {
        username: username.trim(),     // ← backend expects "name", not "username"
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase()  // ← make sure it's lowercase: sponsor, parent, etc.
      };

      const response = await axios.post(API_URL, payload);

      setSuccess('Registration successful! You can now log in.');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole(selectedRole); // keep default
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.details || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your name"
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
            placeholder="Enter mail"
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            placeholder="Minimum 6 characters"
          />
        </div>

        <div className="form-group">
          <label>I am registering as:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={loading}
            style={{ padding: "12px", fontSize: "1em" }}
          >
            <option value="">Choose your role</option>
            <option value="sponsor">Sponsor</option>
            <option value="parent">Parent</option>
            <option value="volunteer">Volunteer</option>
            <option value="case_reporter">Case Reporter</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            background: "#ff8c00",
            color: "white",
            padding: "14px",
            border: "none",
            borderRadius: "50px",
            fontSize: "1.1em",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%"
          }}
        >
          {loading ? 'Creating Account...' : 'Register Now'}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        Already have an account? <span style={{ color: "#ff8c00", cursor: "pointer" }}>Login here</span>
      </p>
    </div>
  );
}

export default RegisterPage;