import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; // Use the same CSS as RegisterPage for consistency

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/login';

      const response = await axios.post(API_URL, {
        email,
        password,
      });

      // --- START: CORRECTION HERE ---
      // The role and user_id are inside the 'user' object in the response.
      const { token, user } = response.data; 
      const role = user.role;
      const userId = user.user_id; // This is the ID used in the volunteer path
      // --- END: CORRECTION HERE ---

      localStorage.setItem('authToken', token);

      console.log('Login Successful, Token:', token);
      setSuccess('Login successful! Redirecting...');
      setEmail('');
      setPassword('');

      // Redirect based on role
      if (role === 'volunteer') {
        if (!userId) {
          setError('User ID (volunteer ID) missing from backend response.');
          setLoading(false);
          return;
        }
        // Use the extracted userId for the dashboard path
        navigate(`/volunteer/${userId}/dashboard`); 
      } else {
        navigate('/'); // All other roles go to home page
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
    <div className="register-container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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

        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;