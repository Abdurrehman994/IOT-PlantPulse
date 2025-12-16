import React, { useEffect, useState } from "react";
import "./Alerts.css"; // optional for styling

export default function Alerts({ sensors }) {
  const [alerts, setAlerts] = useState([]);

  // Define thresholds for alerts
  const thresholds = {
    temperature: { min: 18, max: 30, label: "Temperature (°C)" },
    moisture: { min: 20, max: 80, label: "Soil Moisture (%)" },
    pressure: { min: 980, max: 1050, label: "Pressure (hPa)" },
  };

  useEffect(() => {
    const newAlerts = [];

    Object.keys(thresholds).forEach((key) => {
      const value = sensors[key];
      const { min, max, label } = thresholds[key];
      if (value < min) newAlerts.push(`${label} is too low! (${value})`);
      if (value > max) newAlerts.push(`${label} is too high! (${value})`);
    });

    setAlerts(newAlerts);
  }, [sensors]);

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
