import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import HomePage from "./pages/HomePage.jsx";
import VolunteerDashboard from "./pages/volunteer_dashboard.jsx"; 
import AdminAwarenessDashboard from "./pages/AdminAwarenessDashboard.jsx";   
import AdminVolunteerDashboard from "./pages/AdminVolunteerDashboard.jsx";   
import AdminDashboardHub from "./pages/AdminDashboardHub.jsx";   
import ParentDashboard from "./pages/ParentDashboard.jsx";
import About from "./pages/About.jsx"; 

// Components
import NavBar from "./components/Navbar.jsx"; 
import UserProfile from "./components/User/UserProfile.jsx"; 

// Volunteer Components
import VolunteerAvailability from "./components/volunteer/VolunteerAvailability.jsx"; 
import VolunteerVisits from "./components/volunteer/VolunteerVisits.jsx"; 

// Parent Components
import RegisterFamily from "./components/parent/parentFamilyRegistration.jsx";
import ParentChildren from "./components/parent/parentChildProfile.jsx";
import ParentChallans from "./components/parent/parentFeeChallan.jsx";

import './App.css';

// --- Protected Route Component ---
const ProtectedRoute = ({ children, user, requiredRole }) => {
  if (!user || !user.id) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Access Denied</h2>
        <p>You do not have the required role to view this page.</p>
      </div>
    );
  }
  return children;
};

// --- Wrapper Components for Volunteer Sub-Pages ---
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
    console.log("Signed out successfully");
  };

  const openPanel = (tab) => {
    const event = new CustomEvent('openAuthPanel', { detail: tab });
    window.dispatchEvent(event);
  };

  return (
    <div className="App">
      <NavBar user={user} onLogout={handleLogout} openPanel={openPanel} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage user={user} onLogin={handleLoginSuccess} />} />
        <Route path="/about" element={<About />} />

        {/* Profile Route */}
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

        {/* Volunteer Routes */}
        <Route path="/volunteer/:volunteerId/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteer/:volunteerId/availability" element={<VolunteerAvailabilityWrapper />} />
        <Route path="/volunteer/:volunteerId/visits" element={<VolunteerVisitsWrapper type="pending" />} />
        <Route path="/volunteer/:volunteerId/completed" element={<VolunteerVisitsWrapper type="completed" />} />

        {/* Admin Routes */}
        <Route path="/admin/awareness" element={<AdminAwarenessDashboard />} />
        <Route path="/admin/volunteers" element={<AdminVolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboardHub />} />

        {/* Parent Protected Routes */}
        <Route
          path="/parent/dashboard"
          element={<ProtectedRoute user={user} requiredRole="parent"><ParentDashboard /></ProtectedRoute>}
        />
        <Route 
          path="/parent/register-family" 
          element={<ProtectedRoute user={user} requiredRole="parent"><RegisterFamily /></ProtectedRoute>} 
        />
        <Route 
          path="/parent/children" 
          element={<ProtectedRoute user={user} requiredRole="parent"><ParentChildren /></ProtectedRoute>} 
        />
        <Route 
          path="/parent/challans" 
          element={<ProtectedRoute user={user} requiredRole="parent"><ParentChallans /></ProtectedRoute>} 
        />

      </Routes>
    </div>
  );
}

export default App;
