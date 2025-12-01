// src/App.jsx
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import HomePage from "./pages/HomePage.jsx";
import VolunteerDashboard from "./pages/volunteer_dashboard.jsx"; 
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('user_id');
    
    if (token) {
      setUser({ token, role, id }); 
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData); 
    localStorage.setItem('token', userData.token);
    if(userData.role) localStorage.setItem('role', userData.role);
    if(userData.id) localStorage.setItem('user_id', userData.id);
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
        <Route 
          path="/" 
          element={<HomePage user={user} onLogin={handleLoginSuccess} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            user && user.id ? (
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
        
        {/* Volunteer Hub */}
        <Route path="/volunteer/:volunteerId/dashboard" element={<VolunteerDashboard />} />

        {/* Volunteer Sub-Pages */}
        <Route path="/volunteer/:volunteerId/availability" element={<VolunteerAvailabilityWrapper />} />
        <Route path="/volunteer/:volunteerId/visits" element={<VolunteerVisitsWrapper type="pending" />} />
        <Route path="/volunteer/:volunteerId/completed" element={<VolunteerVisitsWrapper type="completed" />} />

        {/* Admin Routes */}
        <Route path="/admin/awareness" element={<AdminAwarenessDashboard />} />
        <Route path="/admin/volunteers" element={<AdminVolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboardHub />} />
        
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

// --- Wrapper Components ---

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

export default App;