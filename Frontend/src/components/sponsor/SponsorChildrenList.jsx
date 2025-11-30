import React, { useState, useEffect } from "react";
import axios from "axios";
import SponsorCard from "./SponsorCard";
import "./SponsorChildrenList.css";

export default function SponsoredChildrenList() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You must be logged in to view this page.");
          setLoading(false);
          return;
        }

        console.log("Token for children API:", token);

        // Correct API endpoint for sponsor's children
        const res = await axios.get("http://localhost:5000/api/sponsor/children", {
          headers: { Authorization: `Bearer ${token.trim()}` },
        });

        setChildren(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load sponsored children:", err);
        setError("Failed to load sponsored children. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  if (loading) return <p>Loading sponsored children...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (children.length === 0) return <p>No children sponsored yet.</p>;

  return (
    <div className="sponsored-children">
      <h2>Your Sponsored Children</h2>
      <div className="children-grid">
        {children.map((child) => (
          <SponsorCard key={child.id} child={child} />
        ))}
      </div>
    </div>
  );
}
