import React from "react";
import "../styles.css";

export default function Card({ title, value, suffix = "" }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>
        {value}
        {suffix}
      </p>
    </div>
  );
}
