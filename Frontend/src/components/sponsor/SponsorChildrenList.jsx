import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SponsorChildrenList.css";

const API_URL = "http://localhost:5000/api";

export default function SponsorChildrenList({ sponsorId }) {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSponsoredChildren = async () => {
      if (!sponsorId) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/sponsor/${sponsorId}/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChildren(res.data.data || []);
      } catch (err) {
        console.error("Error fetching sponsored children:", err);
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsoredChildren();
  }, [sponsorId, token]);

  if (loading) return <div className="loading">Loading your children...</div>;

  if (children.length === 0)
    return (
      <div className="empty-state">
        <h3>You are not sponsoring any children yet.</h3>
        <p>Visit the "Sponsor a Child" page to begin making a difference!</p>
      </div>
    );

  return (
    <div className="sponsored-children-container">
      <h2>My Sponsored Children</h2>
      <div className="children-grid">
        {children.map((child) => (
          <div key={child.child_id} className="child-card">
            {child.photo ? (
              <img src={child.photo} alt={child.name} />
            ) : (
              <div className="photo-placeholder">No Photo</div>
            )}
            <div className="child-info">
              <h3>{child.name}</h3>
              <p>Age: {child.age} • {child.gender}</p>
              <p>Location: {child.location || "N/A"}</p>
              <p className="sponsored-since">
                Sponsored since: {new Date(child.sponsored_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}