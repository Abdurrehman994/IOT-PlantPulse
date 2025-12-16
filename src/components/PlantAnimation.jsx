import React, { useEffect, useState } from "react";
import "./PlantAnimation.css"; // We'll define transitions here

export default function PlantAnimation({ moisture }) {
  // Limit moisture height for SVG
  const maxHeight = 100;
  const stemHeight = Math.min(moisture, maxHeight);

  return (
    <div className="plant-animation">
      <svg width="100" height="200" viewBox="0 0 100 200">
        {/* Soil */}
        <rect x="0" y="180" width="100" height="20" fill="#8B5E3C" rx="3" />

        {/* Stem */}
        <rect
          x="48"
          y={180 - stemHeight}
          width="4"
          height={stemHeight}
          className="stem"
          fill="url(#stemGradient)"
          rx="2"
        />

        {/* Leaves */}
        <ellipse
          cx="46"
          cy={180 - stemHeight + 20}
          rx="8"
          ry="4"
          className="leaf"
          fill="url(#leafGradient)"
          transform={`rotate(-20 46 ${180 - stemHeight + 20})`}
        />
        <ellipse
          cx="54"
          cy={180 - stemHeight + 40}
          rx="8"
          ry="4"
          className="leaf"
          fill="url(#leafGradient)"
          transform={`rotate(20 54 ${180 - stemHeight + 40})`}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
