// src/components/auth/FeatureIconSVG.jsx
import React from "react";

const FeatureIconSVG = ({ type }) => {
  const iconMap = {
    ai: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
          fill="#3EB489"
        />
      </svg>
    ),
    security: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
        <path
          d="M12 2L3 7l9 18 9-18-9-5zM12 7.5l5.5 2.25L12 21 6.5 9.75 12 7.5z"
          fill="#3EB489"
        />
      </svg>
    ),
    growth: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#3EB489" fillOpacity="0.1" />
        <path
          d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"
          fill="#3EB489"
        />
      </svg>
    ),
  };
  return iconMap[type] || iconMap.ai;
};

export default FeatureIconSVG;