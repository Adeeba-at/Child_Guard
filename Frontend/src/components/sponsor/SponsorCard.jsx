import React from "react";
import "./SponsorCard.css";

const SponsorCard = ({ child, onClick }) => {
  return (
    <div className="child-card" onClick={onClick}>
      <img
        src={child.photo || "/default-child.jpg"}
        alt={child.name}
        className="child-photo"
      />
      <div className="child-info">
        <h3>{child.name}</h3>
        <p>Age: {child.age}</p>
        <p>Grade: {child.grade}</p>
        <p>Gender: {child.gender}</p>
        <p>School: {child.school_name}</p>
        <p>City: {child.city}</p>
      </div>
    </div>
  );
};

export default SponsorCard;
