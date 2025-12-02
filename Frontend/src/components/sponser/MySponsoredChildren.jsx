import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MySponsoredChildren() {
  const { sponsorId } = useParams();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsored = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sponsor/my-sponsored-children/${sponsorId}`);
        setChildren(res.data);
      } catch (err) {
        console.error("Failed to fetch sponsored children", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsored();
  }, [sponsorId]);

  if (loading) return <p>Loading your sponsored children...</p>;
  if (children.length === 0) return <p>You have not sponsored any children yet.</p>;

  return (
    <div className="my-sponsored-children">
      <h2>My Sponsored Children</h2>
      <div className="children-grid">
        {children.map((child) => (
          <div key={child.child_id} className="child-card">
            <img src={child.photo_url || "/default-child.png"} alt={child.name} />
            <h3>{child.name}</h3>
            <p>Age: {child.age}</p>
            <p>Location: {child.location || "Unknown"}</p>
            <p>Story: {child.story?.substring(0, 80) + "..."}</p>
            <p>Status: {child.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
