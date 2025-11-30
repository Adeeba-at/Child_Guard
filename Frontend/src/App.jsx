// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from "./pages/HomePage.jsx";
import VolunteerDashboard from "./pages/volunteer_dashboard.jsx"; 
import AdminAwarenessDashboard from "./pages/AdminAwarenessDashboard.jsx";  
import AdminVolunteerDashboard from "./pages/AdminVolunteerDashboard.jsx";
import AdminDashboardHub from "./pages/AdminDashboardHub.jsx";

// NEW SPONSOR PAGES
import SponsorDashboard from "./pages/SponsorDashboard.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";

import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Volunteer */}
        <Route path="/volunteer/:volunteerId/dashboard" element={<VolunteerDashboard />} />

        {/* Admin */}
        <Route path="/admin/awareness" element={<AdminAwarenessDashboard />} />
        <Route path="/admin/volunteers" element={<AdminVolunteerDashboard />} />
        <Route path="/admin" element={<AdminDashboardHub />} />

        {/* Sponsor */}
        <Route path="/sponsor/dashboard" element={<SponsorDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
