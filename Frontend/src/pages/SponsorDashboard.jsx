// src/pages/SponsorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "./SponsorDashboard.css";

const API_URL = "http://localhost:5000/api/admin";

export default function SponsorDashboard() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("authToken");

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/sponsors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSponsors(res.data.data);
    } catch (err) {
      toast.error("Failed to load sponsors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleApprove = async (sponsor_id) => {
    if (!window.confirm("Approve this sponsor?")) return;

    try {
      await axios.patch(
        `${API_URL}/sponsors/${sponsor_id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Sponsor approved!");
      fetchSponsors();
    } catch (err) {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (sponsor_id) => {
    if (!window.confirm("Reject this sponsor?")) return;

    try {
      await axios.patch(
        `${API_URL}/sponsors/${sponsor_id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Sponsor rejected");
      fetchSponsors();
    } catch (err) {
      toast.error("Failed to reject");
    }
  };

  const filtered = sponsors.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const colors = {
      requested: "#ffc107",
      approved: "#28a745",
      rejected: "#dc3545",
      pending: "#6c757d",
    };
    return (
      <span
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          backgroundColor: colors[status] || "#ccc",
          color: "white",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="loading">Loading sponsors...</div>;

  return (
    <div className="admin-volunteer-dashboard">
      <Toaster position="top-right" />

      <h1>Sponsor Management</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="volunteer-table-container">
        <table className="volunteer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Occupation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.sponsor_id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.email}</td>
                <td>{s.occupation || "-"}</td>
                <td>{getStatusBadge(s.status)}</td>
                <td>
                  {s.status === "requested" && (
                    <>
                      <button
                        onClick={() => handleApprove(s.sponsor_id)}
                        className="btn-approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(s.sponsor_id)}
                        className="btn-reject"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {s.status === "approved" && "Active"}
                  {s.status === "rejected" && "Rejected"}
                  {s.status === "pending" && "Not applied yet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No sponsors found.
          </p>
        )}
      </div>
    </div>
  );
}
