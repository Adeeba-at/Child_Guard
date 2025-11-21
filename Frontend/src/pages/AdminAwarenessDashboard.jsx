// src/pages/AdminAwarenessDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AwarenessContentList from "../../components/admin/AwarenessContentList";
import AwarenessContentForm from "../../components/admin/AwarenessContentForm";

import "./AdminAwarenessDashboard.css"; // ← now same name as the file

const AdminAwarenessDashboard = () => {
  const [activeTab, setActiveTab] = useState("list"); // "list" or "create"
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const API_URL = "http://localhost:5000";
  const token = localStorage.getItem("authToken");

  // Simple protection – redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const handleContentCreatedOrUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("list"); // return to list after save
  };

  return (
    <div className="admin-awareness-dashboard">
      <h1 style={{ textAlign: "center", color: "#008080", marginBottom: "30px" }}>
        Admin – ChildGuard Awareness Content Manager
      </h1>

      {/* TABS – EXACT SAME STYLE AS VOLUNTEER DASHBOARD */}
      <div className="dashboard-tabs">
        <button
          className={activeTab === "list" ? "active" : ""}
          onClick={() => setActiveTab("list")}
        >
          All Content (incl. drafts)
        </button>

        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          + Create New Content
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-content" style={{ marginTop: "30px" }}>
        {activeTab === "list" && (
          <AwarenessContentList
            key={refreshTrigger}
            onEdit={() => setActiveTab("create")}
            onContentDeleted={() => setRefreshTrigger((p) => p + 1)}
          />
        )}

        {activeTab === "create" && (
          <AwarenessContentForm onSuccess={handleContentCreatedOrUpdated} />
        )}
      </div>
    </div>
  );
};

export default AdminAwarenessDashboard;