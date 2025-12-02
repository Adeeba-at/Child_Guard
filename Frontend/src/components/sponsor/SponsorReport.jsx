import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SponsorReport.css";

const API_URL = "http://localhost:5000/api";

export default function SponsorReports({ sponsorId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReports = async () => {
      if (!sponsorId) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/sponsor/${sponsorId}/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [sponsorId, token]);

  if (loading) return <div className="loading">Loading reports...</div>;

  if (reports.length === 0)
    return (
      <div className="empty-state">
        <h3>No Reports Available Yet</h3>
        <p>Progress reports and updates will appear here once available.</p>
      </div>
    );

  return (
    <div className="reports-container">
      <h2>Child Progress Reports & Updates</h2>
      <div className="reports-grid">
        {reports.map((report) => (
          <div key={report.report_id} className="report-card">
            {report.photo && <img src={report.photo} alt="Report" />}
            <div className="report-content">
              <h3>{report.child_name}</h3>
              <p className="report-date">
                {new Date(report.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="report-text">{report.message || "No message provided."}</p>
              {report.attachment && (
                <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="download-link">
                  Download Attachment
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}