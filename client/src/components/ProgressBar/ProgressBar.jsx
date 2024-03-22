import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ label, value, maxValue, color }) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-labels">
        <span>{label}</span>
        <span>{`${value}/${maxValue}`}</span>
      </div>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
