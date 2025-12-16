import React, { useEffect, useState } from "react";
import "./Alerts.css";

// Static thresholds (outside component)
const thresholds = {
  temperature: {
    min: 10,
    max: 30,
    label: "Temperature (°C)",
  },
  moisture: {
    min: 30,
    label: "Soil Moisture (%)",
  },
  pressure: {
    label: "Pressure (kPa)",
  },
};

export default function Alerts({ sensors }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!sensors) return;

    const newAlerts = [];

    Object.keys(thresholds).forEach((key) => {
      const value = sensors[key];
      const { min, max, label } = thresholds[key];

      if (value === undefined || value === null) return;

      if (min !== undefined && value < min) {
        newAlerts.push(`${label} is too low! (${value})`);
      }

      if (max !== undefined && value > max) {
        newAlerts.push(`${label} is too high! (${value})`);
      }
    });

    setAlerts(newAlerts);
  }, [sensors]); // ✅ ESLint happy

  if (!alerts.length) return null;

  return (
    <div className="alerts-container">
      {alerts.map((alert, i) => (
        <div key={i} className="alert">
          ⚠️ {alert}
        </div>
      ))}
    </div>
  );
}
