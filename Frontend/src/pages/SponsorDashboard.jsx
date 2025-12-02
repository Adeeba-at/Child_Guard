import React, { useState } from "react";
import SponsorChildrenList from "../components/sponsor/SponsorChildrenList";         // Your sponsored kids
import SponsorApplications from "../components/sponsor/SponsorApplication";
import SponsorReports from "../components/sponsor/SponsorReport";
import SponsorNewChild from "../components/sponsor/SponsorNewChild";               // ← NEW COMPONENT

import "./SponsorDashboard.css";

const SponsorDashboard = () => {
  const [activeSection, setActiveSection] = useState("children");
  const sponsorId = localStorage.getItem("userId");

  const sections = [
    {
      id: "children",
      label: "SPONSORED CHILDREN",
      title: "My Sponsored Children",
      desc: "View and interact with children you are currently sponsoring",
    },
    {
      id: "newchild",
      label: "SPONSOR A CHILD",
      title: "Find a Child to Sponsor",
      desc: "Browse children waiting for sponsorship",
    },
    {
      id: "applications",
      label: "APPLICATIONS",
      title: "My Applications",
      desc: "Track status of your sponsorship applications",
    },
    {
      id: "reports",
      label: "REPORTS",
      title: "Reports & Updates",
      desc: "View progress reports, photos, and updates",
    },
  ];

  return (
    <div className="sponsor-dashboard-container">
      <header className="sponsor-header">
        <h1>Welcome, Sponsor!</h1>
        <p>Choose a management area.</p>
      </header>

      <div className="sponsor-sections-grid">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`sponsor-card ${activeSection === section.id ? "active" : ""}`}
            onClick={() => setActiveSection(section.id)}
          >
            <div className="sponsor-pill">
              <span>{section.label}</span>
            </div>
            <div className="sponsor-card-content">
              <h3>{section.title}</h3>
              <p>{section.desc}</p>
            </div>
            {activeSection === section.id && <div className="active-line"></div>}
          </div>
        ))}
      </div>

      <div className="sponsor-full-content">
        {activeSection === "children" && <SponsorChildrenList sponsorId={sponsorId} />}
        {activeSection === "newchild" && <SponsorNewChild sponsorId={sponsorId} />}
        {activeSection === "applications" && <SponsorApplications sponsorId={sponsorId} />}
        {activeSection === "reports" && <SponsorReports sponsorId={sponsorId} />}
      </div>
    </div>
  );
};

export default SponsorDashboard;