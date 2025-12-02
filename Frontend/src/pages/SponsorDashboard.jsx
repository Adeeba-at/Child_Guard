// src/pages/SponsorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./AdminDashboardHub.css"; // Use the same CSS as admin

import MatchingChildren from "../components/children/MatchingChildren";
import MySponsoredChildren from "../components/sponser/MySponsoredChildren";

const SponsorDashboard = () => {
  const { sponsorId } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState(null); // No tab active by default
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({ 
    phone: "", 
    minAge: "", 
    maxAge: "", 
    location: "" 
  });

  const API_URL = "http://localhost:5000/api/sponsor";

  const fetchSponsorData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please log in first");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/profile/${sponsorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSponsor(res.data);

      // Parse preferences if available
      if (res.data.preferences) {
        try {
          const prefs = JSON.parse(res.data.preferences);
          const [minAge = "", maxAge = ""] = prefs.ageRange ? prefs.ageRange.split('-') : ["", ""];
          setEditData({
            phone: res.data.phone || "",
            minAge,
            maxAge,
            location: prefs.location || "",
          });
        } catch (e) {
          console.error("Failed to parse preferences:", e);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching sponsor data:", error);
      setMessage("Failed to load sponsor profile.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sponsorId) fetchSponsorData();
  }, [sponsorId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!editData.phone.trim()) {
        alert("Please enter your phone number");
        return;
      }
      if (!editData.minAge || !editData.maxAge) {
        alert("Please enter both minimum and maximum age");
        return;
      }
      
      const minAge = parseInt(editData.minAge);
      const maxAge = parseInt(editData.maxAge);
      
      if (isNaN(minAge) || isNaN(maxAge)) {
        alert("Age must be a valid number");
        return;
      }
      if (minAge < 1 || maxAge > 18) {
        alert("Age must be between 1 and 18");
        return;
      }
      if (minAge > maxAge) {
        alert("Minimum age cannot be greater than maximum age");
        return;
      }
      if (!editData.location.trim()) {
        alert("Please enter a location");
        return;
      }

      const token = localStorage.getItem("token");
      
      const payload = {
        phone: editData.phone.trim(),
        preferences: {
          ageRange: `${minAge}-${maxAge}`,
          location: editData.location.trim()
        }
      };

      const res = await axios.put(
        `${API_URL}/profile/${sponsorId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSponsor(res.data);
      setIsEditing(false);
      setActiveTab(null); // Return to main view
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.error || err.response?.data?.details || "Failed to save sponsor info.");
    }
  };

  if (loading) {
    return (
      <div className="admin-hub">
        <h1>Sponsor Dashboard</h1>
        <p className="hub-subtitle">Loading your profile...</p>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="admin-hub">
        <h1>Sponsor Dashboard</h1>
        <p className="hub-subtitle">{message || "Error loading sponsor profile."}</p>
      </div>
    );
  }

  // Parse preferences for display
  let preferencesDisplay = { ageRange: "Not set", location: "Not set" };
  if (sponsor.preferences) {
    try {
      const prefs = JSON.parse(sponsor.preferences);
      preferencesDisplay = {
        ageRange: prefs.ageRange || "Not set",
        location: prefs.location || "Not set"
      };
    } catch (e) {
      console.error("Failed to parse preferences:", e);
    }
  }

  // Edit Form View
  if (isEditing) {
    return (
      <div className="admin-hub">
        <h1>Edit Your Profile</h1>
        <p className="hub-subtitle">Update your contact details and child preferences</p>

        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d5f5f', marginBottom: '8px' }}>
              Phone Number <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={editData.phone}
              onChange={handleEditChange}
              placeholder="+92 300 1234567"
              style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d5f5f', marginBottom: '8px' }}>
              Child Age Range <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input
                type="number"
                name="minAge"
                value={editData.minAge}
                onChange={handleEditChange}
                placeholder="Min"
                min="1"
                max="18"
                style={{ flex: '1', maxWidth: '100px', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
              <span style={{ fontWeight: '600', color: '#6b7280' }}>to</span>
              <input
                type="number"
                name="maxAge"
                value={editData.maxAge}
                onChange={handleEditChange}
                placeholder="Max"
                min="1"
                max="18"
                style={{ flex: '1', maxWidth: '100px', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
              />
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>years old</span>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d5f5f', marginBottom: '8px' }}>
              Preferred Location <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              name="location"
              value={editData.location}
              onChange={handleEditChange}
              placeholder="e.g. Lahore, Karachi, Islamabad"
              style={{ width: '100%', padding: '12px', border: '2px solid #d1d5db', borderRadius: '8px', fontSize: '1rem' }}
            />
            <small style={{ display: 'block', color: '#6b7280', fontSize: '0.85rem', marginTop: '5px' }}>
              Enter city or area name
            </small>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button 
              onClick={handleSave}
              style={{ flex: '1', padding: '12px 30px', background: '#0d9488', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Save Changes
            </button>
            <button 
              onClick={() => { setIsEditing(false); setActiveTab(null); }}
              style={{ flex: '1', padding: '12px 30px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Content Views
  if (activeTab) {
    return (
      <div className="admin-hub">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1>{activeTab === "preferences" ? "My Preferences" : activeTab === "matching" ? "Matching Children" : "My Sponsored Children"}</h1>
            <p className="hub-subtitle">
              {activeTab === "preferences" && "View and update your profile and preferences"}
              {activeTab === "matching" && "Explore children who match your preferences"}
              {activeTab === "sponsored" && "Children you are currently sponsoring"}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab(null)}
            style={{ padding: '10px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
          >
            ← Back
          </button>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minHeight: '400px' }}>
          {activeTab === "preferences" && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', color: '#0d5f5f', marginBottom: '30px' }}>Your Current Preferences</h3>
              <div style={{ maxWidth: '600px', margin: '0 auto 30px', textAlign: 'left' }}>
                <div style={{ background: '#f0fdfa', padding: '15px 20px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #0d9488', fontSize: '1.1rem', color: '#0d5f5f' }}>
                  <strong style={{ color: '#0d9488', marginRight: '10px' }}>Phone:</strong> {sponsor.phone || "Not set"}
                </div>
                <div style={{ background: '#f0fdfa', padding: '15px 20px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #0d9488', fontSize: '1.1rem', color: '#0d5f5f' }}>
                  <strong style={{ color: '#0d9488', marginRight: '10px' }}>Age Range:</strong> {preferencesDisplay.ageRange}
                </div>
                <div style={{ background: '#f0fdfa', padding: '15px 20px', marginBottom: '15px', borderRadius: '8px', borderLeft: '4px solid #0d9488', fontSize: '1.1rem', color: '#0d5f5f' }}>
                  <strong style={{ color: '#0d9488', marginRight: '10px' }}>Preferred Location:</strong> {preferencesDisplay.location}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                style={{ background: '#0d9488', color: 'white', padding: '12px 40px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Edit Preferences
              </button>
            </div>
          )}
          {activeTab === "matching" && <MatchingChildren sponsorId={sponsorId} />}
          {activeTab === "sponsored" && <MySponsoredChildren sponsorId={sponsorId} />}
        </div>
      </div>
    );
  }

  // Main Dashboard View (Like Admin)
  return (
    <div className="admin-hub">
      <h1>Welcome, Sponsor!</h1>
      <p className="hub-subtitle">Choose a management area</p>

      {message && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '15px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #c3e6cb', textAlign: 'center' }}>
          {message}
        </div>
      )}

      <div className="admin-cards">
        {/* Card 1: My Preferences */}
        <div className="admin-card" onClick={() => setActiveTab("preferences")}>
          <div className="card-header teal-header">YOUR PREFERENCES</div>
          <h2>My Preferences</h2>
          <p>
            View and update your profile and child-matching preferences
          </p>
        </div>

        {/* Card 2: Matching Children */}
        <div className="admin-card" onClick={() => setActiveTab("matching")}>
          <div className="card-header teal-header">MATCHING</div>
          <h2>Matching Children</h2>
          <p>Explore children who currently match your preferences</p>
        </div>

        {/* Card 3: My Sponsored Children */}
        <div className="admin-card" onClick={() => setActiveTab("sponsored")}>
          <div className="card-header teal-header">SPONSORED</div>
          <h2>My Sponsored Children</h2>
          <p>Check the progress of children you are currently sponsoring</p>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;