import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SponsorApplication.css";

const API_URL = "http://localhost:5000/api";

export default function SponsorApplications({ sponsorId }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!sponsorId) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/sponsor/${sponsorId}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [sponsorId, token]);

  if (loading) return <div className="loading">Loading your applications...</div>;

  if (applications.length === 0)
    return (
      <div className="empty-state">
        <h3>No Applications Yet</h3>
        <p>You haven't submitted any sponsorship applications.</p>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "#28a745";
      case "pending": return "#ffc107";
      case "rejected": return "#dc3545";
      default: return "#6c757d";
    }
  };

  return (
    <div className="applications-container">
      <h2>My Sponsorship Applications</h2>
      <div className="applications-list">
        {applications.map((app) => (
          <div key={app.application_id} className="application-card">
            <div className="app-header">
              <h3>Application #{app.application_id}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(app.status) }}
              >
                {app.status.toUpperCase()}
              </span>
            </div>
            <div className="app-details">
              <p><strong>Child:</strong> {app.child_name || "N/A"}</p>
              <p><strong>Submitted:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
              {app.updated_at && (
                <p><strong>Last Updated:</strong> {new Date(app.updated_at).toLocaleDateString()}</p>
              )}
              {app.message && <p><strong>Notes:</strong> {app.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}