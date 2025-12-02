import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedVisits.css";

const AssignedVisits = ({ volunteerId }) => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [feedbackText, setFeedbackText] = useState(""); 
  const [activeVisitId, setActiveVisitId] = useState(null); 

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
    if (!feedbackText.trim()) {
      alert("Feedback cannot be empty");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `${API_URL}visits/${visitId}/feedback`,
        { findings: feedbackText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Feedback submitted successfully!");
      setFeedbackText("");
      setActiveVisitId(null);
      fetchAssignedVisits(); 
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
            <p>
              <strong>Status:</strong> 
              <span className={`status-badge ${visit.status === "completed" ? "status-completed" : "status-assigned"}`}>
                {visit.status}
              </span>
            </p>

            {activeVisitId === visit.visit_id ? (
              <div className="feedback-section">
                <textarea
                  placeholder="Enter your findings..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                />
                <div className="feedback-actions">
                  <button
                    className="btn-submit"
                    onClick={() => handleFeedbackSubmit(visit.visit_id)}
                  >
                    Submit
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setActiveVisitId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-action"
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
