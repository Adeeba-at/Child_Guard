import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SponsorProfile.css";

const API_URL = "http://localhost:5000/api";

export default function SponsorProfile({ sponsorId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_URL}/sponsor/${sponsorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.sponsor);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [sponsorId]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="sponsor-profile">
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <p>City: {profile.city}</p>
      <p>Total Sponsored Children: {profile.total_sponsored}</p>
    </div>
  );
}
