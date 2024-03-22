import React from "react";
import "./ProgressCard.css";

const ProgressCard = ({ title, value }) => {
  const getColorClass = (title) => {
    switch (title) {
      case "Daily Goal":
        return "blue";
      case "Calories Consumed":
        return "red";
      case "Calories To Go":
        return "green";
      default:
        return "";
    }
  };

  const colorClass = getColorClass(title);

  return (
    <div className={`progress-card ${colorClass}`}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default ProgressCard;
