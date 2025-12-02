import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css'; 

function NavBar({ user, onLogout, openPanel }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine label: Show 'Dashboard' if on Home OR About page
  const getDynamicLabel = () => {
    if (!user) return null;
    if (location.pathname === '/' || location.pathname === '/about') {
      return 'Dashboard';
    }
    return 'Home';
  };

  const handleDynamicClick = () => {
    if (user && (location.pathname === '/' || location.pathname === '/about')) {
      switch (user.role) {
        case 'volunteer':
          navigate(`/volunteer/${user.id}/dashboard`);
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'sponsor':
          navigate(`/sponsor/${user.id}/dashboard`);
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleAuthClick = (type) => {
    if (location.pathname === '/') {
      openPanel(type);
    } else {
      navigate('/', { state: { openAuthPanel: type } });
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          ChildGuard
        </div>

        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate('/about')}>
            About Us
          </button>

          {user ? (
            <>
              {/* Dashboard / Home */}
              <button className="nav-btn" onClick={handleDynamicClick}>
                {getDynamicLabel()}
              </button>

              {/* Profile (centralized) */}
              <button className="nav-btn" onClick={() => navigate('/profile')}>
                Profile
              </button>

              <button className="nav-btn logout-btn" onClick={onLogout}>
                Sign Out
              </button>
            </>
          ) : (
            location.pathname === '/about' ? (
              <button className="nav-btn" onClick={() => navigate('/')}>
                Home
              </button>
            ) : (
              <>
                <button className="nav-btn" onClick={() => handleAuthClick('login')}>
                  Login
                </button>
                <button className="nav-btn" onClick={() => handleAuthClick('register')}>
                  Register
                </button>
              </>
            )
          )}
        </div>
      </nav>

      <div className="navbar-spacer"></div>
    </>
  );
}

export default NavBar;
