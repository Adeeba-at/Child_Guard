import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import HomePage from "./pages/HomePage.jsx";
import VolunteerDashboard from "./pages/volunteer_dashboard.jsx"; 
import SponsorDashboard from "./pages/SponsorDashboard.jsx";
import AdminAwarenessDashboard from "./pages/AdminAwarenessDashboard.jsx";   
import AdminVolunteerDashboard from "./pages/AdminVolunteerDashboard.jsx";   
import AdminDashboardHub from "./pages/AdminDashboardHub.jsx";   
import About from "./pages/About.jsx";

// Components
import NavBar from "./components/Navbar.jsx";  
import UserProfile from "./components/User/UserProfile.jsx";
import VolunteerAvailability from "./components/volunteer/VolunteerAvailability.jsx"; 
import VolunteerVisits from "./components/volunteer/VolunteerVisits.jsx"; 

import './App.css';

function App() {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('user_id');

    if (token && role && id) {
      setUser({ token, role, id });

      // Auto-redirect to dashboard if already logged in
      switch(role) {
        case 'volunteer':
          navigate(`/volunteer/${id}/dashboard`);
          break;
        case 'sponsor':
          navigate(`/sponsor/${id}/dashboard`);
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          break;
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('user_id', userData.id);

    // Navigate automatically after login
    switch(userData.role) {
      case 'volunteer':
        navigate(`/volunteer/${userData.id}/dashboard`);
        break;
      case 'sponsor':
        navigate(`/sponsor/${userData.id}/dashboard`);
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/');
    alert("Signed out successfully");
  };

  const openPanel = (tab) => {
    const event = new CustomEvent('openAuthPanel', { detail: tab });
    window.dispatchEvent(event);
  };

  return (
    <div className="App">
      <NavBar user={user} onLogout={handleLogout} openPanel={openPanel} />

      <Routes>
        {/* Landing / Home */}
        <Route path="/" element={<HomePage user={user} onLogin={handleLoginSuccess} />} />

        {/* Generic Profile Route */}
        <Route 
          path="/profile" 
          element={
            user ? (
              <div className="dashboard-container">
                <UserProfile userId={user.id} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your profile.</p>
                <button onClick={() => openPanel('login')}>Login Now</button>
              </div>
            )
          } 
        />

        {/* Volunteer Routes */}
        <Route path="/volunteer/:volunteerId/dashboard" element={<VolunteerDashboardWrapper />} />
        <Route path="/volunteer/:volunteerId/availability" element={<VolunteerAvailabilityWrapper />} />
        <Route path="/volunteer/:volunteerId/visits" element={<VolunteerVisitsWrapper type="pending" />} />
        <Route path="/volunteer/:volunteerId/completed" element={<VolunteerVisitsWrapper type="completed" />} />

        {/* Sponsor Routes */}
        <Route path="/sponsor/:sponsorId/dashboard" element={<SponsorDashboardWrapper />} />

        {/* Admin Routes */}
        <Route path="/admin/awareness" element={<AdminAwarenessDashboard />} />
        <Route path="/admin/volunteers" element={<AdminVolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboardHub />} />

        {/* About Page */}
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

// ---------------- Wrapper Components ----------------

// Volunteer Wrappers
const VolunteerDashboardWrapper = () => {
  const { volunteerId } = useParams();
  return <VolunteerDashboard volunteerId={volunteerId} />;
};

const VolunteerAvailabilityWrapper = () => {
  const { volunteerId } = useParams();
  return (
    <div className="dashboard-container">
      <VolunteerAvailability volunteerId={volunteerId} />
    </div>
  );
};

const VolunteerVisitsWrapper = ({ type }) => {
  const { volunteerId } = useParams();
  return (
    <div className="dashboard-container">
      <VolunteerVisits volunteerId={volunteerId} only={type} />
    </div>
  );
};

// Sponsor Dashboard Wrapper
const SponsorDashboardWrapper = () => {
  const { sponsorId } = useParams();
  return (
    <div className="dashboard-container">
      <SponsorDashboard sponsorId={sponsorId} />
    </div>
  );
};

export default App;
