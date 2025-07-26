// src/components/auth/BackgroundSVG.jsx
import React from "react";

const BackgroundSVG = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-10"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="authGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3EB489" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#2ea374" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="authGradient2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#3EB489" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#3EB489" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="150" cy="150" r="100" fill="url(#authGradient2)" />
    <circle cx="850" cy="850" r="150" fill="url(#authGradient2)" />
    <path
      d="M0 500 Q 250 250 500 500 T 1000 500"
      stroke="url(#authGradient1)"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M500 0 Q 750 250 500 500 T 500 1000"
      stroke="url(#authGradient1)"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export default BackgroundSVG;