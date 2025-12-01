// src/pages/VolunteerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import VolunteerApprovalRequest from "../components/volunteer/VolunteerApprovalRequest";
import AssignedVisits from "../components/volunteer/AssignedVisits"; 
import VolunteerVisits from "../components/volunteer/VolunteerVisits";

import "./volunteer_dashboard.css";

const VolunteerDashboard = () => {
  const { volunteerId } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  const API_URL = "http://localhost:5000/";

  const fetchVolunteerData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const res = await axios.get(`${API_URL}volunteer/${volunteerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let vol = res.data.volunteer;
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

  if (loading)
    return (
      <div className="volunteer-dashboard">
        <p>Loading dashboard...</p>
      </div>
    );

  if (!volunteer)
    return (
      <div className="volunteer-dashboard">
        <p>{message || "No volunteer data found."}</p>
      </div>
    );

  // --- VIEW 1: REQUESTED STATUS ---
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

  // --- VIEW 2: PENDING INFO REQUIRED ---
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

  // --- VIEW 3: APPROVED DASHBOARD ---
  return (
    <div className="volunteer-dashboard">
      <h1>Volunteer Dashboard</h1>
      <p className="volunteer-subtitle">Welcome back, {volunteer.name || "Volunteer"}</p>

      <div className="dashboard-actions">
        <Link
          to={`/volunteer/${volunteerId}/availability`}
          className="action-btn secondary"
        >
          📅 Update Availability
        </Link>
      </div>

      <hr className="divider" />

      {/* Tabs */}
      <div className="dashboard-tabs-control">
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Assigned Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History (Completed)
        </button>
      </div>

      <div className="dashboard-content-area fade-in">
        {activeTab === 'tasks' && <AssignedVisits volunteerId={volunteerId} />}
        {activeTab === 'history' && <VolunteerVisits volunteerId={volunteerId} />}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
