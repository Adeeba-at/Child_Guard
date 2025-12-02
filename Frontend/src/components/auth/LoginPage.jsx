import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './LoginPage.css';

function LoginPage({ onLogin, closeModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetMode, setResetMode] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/login';
      const response = await axios.post(API_URL, { email, password });

      const { token, user } = response.data;
      const role = user.role;
      const userId = user.user_id;

      if (!token) {
        setError('Login failed: no token returned.');
        setLoading(false);
        return;
      }

      localStorage.setItem('authToken', token);
      if (onLogin) onLogin({ token, role, id: userId });

      setSuccess('Login successful!');
      setEmail('');
      setPassword('');
      if (closeModal) closeModal();

      if (role === 'volunteer') navigate(`/volunteer/${userId}/dashboard`);
      else if (role === 'admin') navigate('/admin');
      else if (role === 'sponsor') navigate('/sponsor/dashboard');
      else navigate('/');
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) setError(err.response.data.message || 'Invalid email or password.');
      else if (err.request) setError('Cannot connect to server.');
      else setError('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    setError('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/forgot-password';
      const response = await axios.post(API_URL, { email: forgotEmail });
      setForgotMessage(response.data.message || 'Reset token sent!');
      setResetMode(true);
    } catch (err) {
      console.error('Forgot Password Error:', err);
      if (err.response) setForgotMessage(err.response.data.message || 'Error sending reset link.');
      else setForgotMessage('Cannot connect to server.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    setError('');

    try {
      const API_URL = 'http://localhost:5000/api/auth/reset-password';
      const response = await axios.post(API_URL, { token: resetToken, newPassword });

      setForgotMessage(response.data.message || 'Password reset successful!');
      setResetToken('');
      setNewPassword('');
      setTimeout(() => {
        setForgotMode(false);
        setResetMode(false);
        setForgotMessage('');
      }, 1500);
    } catch (err) {
      console.error('Reset Password Error:', err);
      if (err.response) setForgotMessage(err.response.data.message || 'Error resetting password.');
      else setForgotMessage('Cannot connect to server.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="login-container">
      {!forgotMode ? (
        <>
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleLoginSubmit}>
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

            <div className="form-group password-group">
              <label>Password:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <span className="password-toggle" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>

            <p className="forgot-password">
              <a
                href="#"
                className="link-btn"
                onClick={(e) => { e.preventDefault(); setForgotMode(true); }}
              >
                Forgot Password?
              </a>
            </p>
          </form>
        </>
      ) : !resetMode ? (
        <>
          <h1>Forgot Password</h1>
          <form className="login-form" onSubmit={handleForgotSubmit}>
            {forgotMessage && <p className="success-message">{forgotMessage}</p>}
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={forgotLoading}
                placeholder="Enter your registered email"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={forgotLoading}>
              {forgotLoading ? 'Sending...' : 'Send Reset Token'}
            </button>
            <p className="forgot-password">
              <a href="#" className="link-btn" onClick={() => setForgotMode(false)}>Back to Login</a>
            </p>
          </form>
        </>
      ) : (
        <>
          <h1>Reset Password</h1>
          <form className="login-form" onSubmit={handleResetSubmit}>
            {forgotMessage && <p className="success-message">{forgotMessage}</p>}
            <div className="form-group">
              <label>Reset Token:</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                disabled={forgotLoading}
              />
            </div>
            <div className="form-group password-group">
              <label>New Password:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={forgotLoading}
                />
                <span className="password-toggle" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={forgotLoading}>
              {forgotLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p className="forgot-password">
              <a href="#" className="link-btn" onClick={() => setForgotMode(false)}>Back to Login</a>
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default LoginPage;
