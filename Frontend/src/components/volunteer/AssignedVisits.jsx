import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerVisits.css";

const AssignedVisits = ({ volunteerId }) => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [feedbackText, setFeedbackText] = useState(""); // Track input for feedback
  const [activeVisitId, setActiveVisitId] = useState(null); // Track which visit is being updated

  const API_URL = "http://localhost:5000/";

  const fetchAssignedVisits = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}visits/volunteer/${volunteerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pendingData = res.data.visits.filter((v) => v.status !== "completed");
      setAssignedVisits(pendingData);
    } catch (err) {
      console.error("Error fetching assigned visits:", err);
    }
  };

  useEffect(() => {
    if (volunteerId) fetchAssignedVisits();
  }, [volunteerId]);

  const handleFeedbackSubmit = async (visitId) => {
    try {
      if (!feedbackText.trim()) {
        alert("Feedback cannot be empty");
        return;
      }

      const token = localStorage.getItem("authToken");

      const res = await axios.put(
        `${API_URL}visits/${visitId}/feedback`,
        { findings: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Feedback submitted successfully!");
      setFeedbackText("");
      setActiveVisitId(null);
      fetchAssignedVisits(); // Refresh visits list
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="dashboard-box">
      <h2>Upcoming Assigned Visits</h2>

      {assignedVisits.length === 0 ? (
        <p>No active assignments at the moment.</p>
      ) : (
        assignedVisits.map((visit) => (
          <div key={visit.visit_id} className="visit-card assigned-card">
            <p><strong>Target ID:</strong> {visit.target_id}</p>
            <p><strong>Scheduled Date:</strong> {new Date(visit.visit_date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className="status-badge pending">{visit.status}</span></p>

            {activeVisitId === visit.visit_id ? (
              <div className="feedback-section">
                <textarea
                  placeholder="Enter your findings..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                />
                <button
                  className="action-btn"
                  onClick={() => handleFeedbackSubmit(visit.visit_id)}
                >
                  Submit Feedback
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => setActiveVisitId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="action-btn"
                onClick={() => setActiveVisitId(visit.visit_id)}
              >
                Add Feedback
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedVisits;
