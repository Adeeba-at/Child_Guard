import React from "react";
import axios from "axios";
import "./SponsorProfile.css";

export default function SponsorProfile({ profile, setProfile }) {
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found. Please login.");

      await axios.put(
        "http://localhost:5000/api/sponsor/update-profile",
        {
          phone: profile.phone,
          occupation: profile.occupation,
          preferences: profile.preferences,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <form className="sponsor-profile-form" onSubmit={handleSubmit}>

      {/* Name (read-only) */}
      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={profile.name || ""} readOnly />
      </div>

      {/* Email (read-only) */}
      <div className="form-group">
        <label>Email:</label>
        <input type="email" value={profile.email || ""} readOnly />
      </div>

      {/* Status (read-only) */}
      <div className="form-group">
      <label>Status:</label>
      <input
        type="text"
        name="status"
        value={profile.status}
        readOnly
      />
    </div>

      {/* Editable fields */}
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Occupation:</label>
        <input
          type="text"
          name="occupation"
          value={profile.occupation || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Preferences:</label>
        <input
          type="text"
          name="preferences"
          value={profile.preferences || ""}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Update Profile</button>
    </form>
  );
}
