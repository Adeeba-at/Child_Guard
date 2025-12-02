import React, { useEffect, useState } from "react";
import axios from "axios";
import SponsorCard from "./SponsorCard";
import "./SponsorNewChild.css";

const API_URL = "http://localhost:5000/api";

export default function SponsorNewChild({ sponsorId }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");

  const fetchAvailableChildren = async () => {
    try {
      setLoading(true);
      // ✅ FIXED: This endpoint doesn't need sponsorId - it returns ALL available children
      const res = await axios.get(`${API_URL}/sponsor/children/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Available children loaded:', res.data);
      setChildren(res.data.data || []);
    } catch (err) {
      console.error('❌ Error loading children:', err);
      setMessage("Failed to load children.");
    } finally {
      setLoading(false);
    }
  };

  const sponsorChild = async (childId) => {
    try {
      await axios.post(
        `${API_URL}/sponsor/sponsor-child`,
        { sponsorId, childId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Child sponsored successfully!");
      setSelectedChild(null);
      fetchAvailableChildren(); // Refresh the list
    } catch (err) {
      console.error('❌ Error sponsoring child:', err);
      setMessage("Failed to sponsor child. Try again.");
    }
  };

  useEffect(() => {
    fetchAvailableChildren();
  }, []);

  const filteredChildren = children.filter((child) =>
    child.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sponsor-newchild-container">
      <h2>Sponsor a New Child</h2>
      <p className="subtitle">Change a life today — choose a child to sponsor</p>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {message && (
        <p className={`message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      {loading ? (
        <div className="loading">Loading children...</div>
      ) : filteredChildren.length === 0 ? (
        <div className="empty-state">
          <h3>No children available right now</h3>
          <p>Check back soon — new children are added regularly!</p>
        </div>
      ) : (
        <div className="children-grid">
          {filteredChildren.map((child) => (
            <SponsorCard
              key={child.child_id}
              child={child}
              onClick={() => setSelectedChild(child)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedChild && (
        <div className="sponsor-modal-overlay" onClick={() => setSelectedChild(null)}>
          <div className="sponsor-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Sponsorship</h3>
            <div className="modal-child-info">
              <img 
                src={selectedChild.photo || "/placeholder.jpg"} 
                alt={selectedChild.name} 
              />
              <div>
                <h4>{selectedChild.name}</h4>
                <p>Age: {selectedChild.age} • {selectedChild.gender}</p>
                <p>Location: {selectedChild.location}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="confirm-btn" 
                onClick={() => sponsorChild(selectedChild.child_id)}
              >
                Yes, Sponsor This Child
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setSelectedChild(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}