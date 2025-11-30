<<<<<<< HEAD
// src/components/auth/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage({ selectedRole = 'sponsor' }) {  // ← RECEIVE role from HomePage
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // ← will be set from selectedRole
=======
// src/components/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './RegisterPage.css'; 

function RegisterPage({ openPanel }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
>>>>>>> origin/main
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Only one state needed now
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
<<<<<<< HEAD

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
=======
      const payload = { username: username.trim(), email: email.trim(), password, role };
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(API_URL, payload);

      setSuccess('Registration successful! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');

      setTimeout(() => { if (openPanel) openPanel('login'); }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || JSON.stringify(err.response.data));
      } else if (err.request) {
        setError('Cannot connect to the server.');
      } else {
        setError('An unexpected error occurred.');
      }
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
<<<<<<< HEAD

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
=======
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
>>>>>>> origin/main

      <form onSubmit={handleSubmit}>
        <div className="form-group">
<<<<<<< HEAD
          <label>Full Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your name"
          />
=======
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} placeholder="Enter username" />
>>>>>>> origin/main
        </div>

        <div className="form-group">
          <label>Email:</label>
<<<<<<< HEAD
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter mail"
          />
=======
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} placeholder="Enter email" />
>>>>>>> origin/main
        </div>

        {/* --- Password Field (HAS EYE ICON) --- */}
        <div className="form-group password-group">
          <label>Password:</label>
<<<<<<< HEAD
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
=======
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

        {/* --- Confirm Password Field (NO EYE ICON) --- */}
        <div className="form-group password-group">
          <label>Confirm Password:</label>
          <div className="password-wrapper">
            <input
              type="password" /* Always hidden */
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Confirm password"
            />
            {/* Toggle span removed from here */}
          </div>
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required disabled={loading}>
            <option value="">Select Role</option>
            <option value="parent">Parent</option>
>>>>>>> origin/main
            <option value="sponsor">Sponsor</option>
            <option value="parent">Parent</option>
            <option value="volunteer">Volunteer</option>
            <option value="case_reporter">Case Reporter</option>
          </select>
        </div>

<<<<<<< HEAD
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
=======
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
>>>>>>> origin/main
      </form>

      <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        Already have an account? <span style={{ color: "#ff8c00", cursor: "pointer" }}>Login here</span>
      </p>
    </div>
  );
}

export default RegisterPage;