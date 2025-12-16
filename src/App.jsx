import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import Chart from "./components/Chart";
import Alerts from "./components/Alerts";
import PlantAnimation from "./components/PlantAnimation";

import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import "./styles.css";

export default function App() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "mqtt_data"),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      snap.forEach((doc) => setLatest(doc.data()));
    });
    return () => unsub();
  }, []);

  const temperature = latest?.sensors?.temperature ?? 25;
  const moisture = latest?.sensors?.moisture ?? 40;
  const pressure = latest?.sensors?.pressure ?? 1013;

  // 🌙 Day / Night theme
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  return (
    <div
      className={`container ${isNight ? "night" : "day"}`}
      style={{
        "--temp-level": temperature,
        "--moisture-level": moisture,
      }}
    >
      {/* Animated Background */}
      <div className="background">
        {Array.from({ length: 35 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <header className="header">
        <h1>
          PlantPulse — Web Dashboard <span className="live-dot" />
        </h1>
      </header>

      <section className="cards">
        <Card title="Temperature" value={temperature} suffix="°C" />
        <Card title="Pressure" value={pressure} suffix="kPa" />
        <Card title="Soil Moisture" value={moisture} suffix="%" />
      </section>

      <PlantAnimation moisture={latest?.sensors?.moisture ?? 0} />

      <Alerts sensors={{ temperature, moisture, pressure }} />
      {/* Chart */}
      <Chart />
    </div>
  );
}
