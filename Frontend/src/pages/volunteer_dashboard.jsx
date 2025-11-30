// src/pages/VolunteerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import VolunteerApprovalRequest from "../components/volunteer/VolunteerApprovalRequest";
import "./volunteer_dashboard.css";

const VolunteerDashboard = () => {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/";

  const fetchVolunteerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await axios.get(`${API_URL}volunteer/${volunteerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let vol = res.data.volunteer;
      
      // Basic parsing if needed for logic
      if (vol.availability) {
        try {
          vol.availability = JSON.parse(vol.availability);
        } catch {
          vol.availability = { days: [], time: "" };
        }
      }

      setVolunteer(vol);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load volunteer data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (volunteerId) fetchVolunteerData();
  }, [volunteerId]);

  if (loading) return <div className="volunteer-dashboard"><p>Loading dashboard...</p></div>;
  if (!volunteer) return <div className="volunteer-dashboard"><p>{message || "No volunteer data found."}</p></div>;

  // VIEW 1: REQUESTED STATUS
  if (volunteer.status === "requested") {
    return (
      <div className="volunteer-dashboard">
        <h1>Volunteer Dashboard</h1>
        <p className="volunteer-subtitle">Status Check</p>
        <div className="volunteer-card">
            <div className="card-header">Status</div>
            <div className="nav-card-body">
              <h2>Pending Approval</h2>
              <p>Your request has been submitted and is currently pending administrator approval. Please check back later.</p>
            </div>
        </div>
      </div>
    );
  }

  // VIEW 2: PENDING INFO REQUIRED
  if (volunteer.status === "pending") {
    return (
      <div className="volunteer-dashboard">
         <h1>Complete Your Application</h1>
         <p className="volunteer-subtitle">Please provide the missing details below</p>
         <div className="dashboard-content">
            <VolunteerApprovalRequest
              volunteer={volunteer}
              setVolunteer={setVolunteer}
              setMessage={setMessage}
            />
         </div>
      </div>
    );
  }

  // VIEW 3: MAIN DASHBOARD HUB (Approved)
  return (
    <div className="volunteer-dashboard">
        
      <h1>Volunteer Dashboard</h1>
      <p className="volunteer-subtitle">Manage your availability and visits</p>

      <div className="dashboard-tabs">
          
        {/* REMOVED: Profile Card (Accessible via NavBar) */}

        {/* 1. Availability Link */}
        <Link 
          to={`/volunteer/${volunteerId}/availability`} 
          className="nav-card"
        >
          <div className="card-header">Schedule</div>
          <div className="nav-card-body">
            <h2>Availability</h2>
            <p>Set the days and times you are available to help</p>
          </div>
        </Link>

        {/* 2. Assigned Visits Link */}
        <Link 
          to={`/volunteer/${volunteerId}/visits`} 
          className="nav-card"
        >
          <div className="card-header">Tasks</div>
          <div className="nav-card-body">
            <h2>Assigned Visits</h2>
            <p>View your upcoming visits and pending assignments</p>
          </div>
        </Link>

        {/* 3. Completed Visits Link */}
        <Link 
          to={`/volunteer/${volunteerId}/completed`} 
          className="nav-card"
        >
          <div className="card-header">History</div>
          <div className="nav-card-body">
            <h2>Completed Visits</h2>
            <p>Review your history of completed case visits</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default VolunteerDashboard;