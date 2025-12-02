// src/components/children/MatchingChildren.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MatchingChildren() {
  const { sponsorId } = useParams();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/sponsor/matching-children/${sponsorId}`);
        setChildren(res.data);
      } catch (err) {
        console.error("Failed to fetch matching children", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, [sponsorId]);

  const handleSponsor = async (childId) => {
    try {
      await axios.post(`http://localhost:5000/api/sponsor/sponsor-child`, { sponsorId, childId });
      alert("Child sponsored successfully!");
      setChildren(children.filter(c => c.child_id !== childId));
    } catch (err) {
      console.error(err);
      alert("Failed to sponsor child");
    }
  };

  if (loading) return <p>Loading children...</p>;
  if (children.length === 0) return <p>No children match your preferences currently.</p>;

  return (
    <div className="matching-children">
      <h2>Children Matching Your Preferences</h2>
      <div className="children-grid">
        {children.map((child) => (
          <div key={child.child_id} className="child-card">
            <img src={child.photo_url || "/default-child.png"} alt={child.name} />
            <h3>{child.name}</h3>
            <p>Age: {child.age}</p>
            <p>Location: {child.location || "Unknown"}</p>
            <p>Story: {child.story?.substring(0, 80) + "..."}</p>
            <button onClick={() => handleSponsor(child.child_id)} className="btn">
              Sponsor Child
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
