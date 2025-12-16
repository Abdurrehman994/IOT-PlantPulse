import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles.css";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function Chart() {
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [visible, setVisible] = useState({
    temperature: true,
    moisture: true,
    pressure: true,
  });

  const [showStats, setShowStats] = useState(true);
  const [last3Hours, setLast3Hours] = useState(false);

  /* --------------------------------------------------
     RESET DATE RANGE WHEN LAST 3 HOURS IS ENABLED
  -------------------------------------------------- */
  useEffect(() => {
    if (last3Hours) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [last3Hours]);

  /* --------------------------------------------------
     FIRESTORE REAL-TIME QUERY
  -------------------------------------------------- */
  useEffect(() => {
    const colRef = collection(db, "mqtt_data");
    let q;

    if (last3Hours) {
      const now = new Date();
      const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

      q = query(
        colRef,
        where("timestamp", ">=", Timestamp.fromDate(threeHoursAgo)),
        where("timestamp", "<=", Timestamp.fromDate(now)),
        orderBy("timestamp")
      );
    } else if (startDate && endDate) {
      q = query(
        colRef,
        where("timestamp", ">=", Timestamp.fromDate(startDate)),
        where("timestamp", "<=", Timestamp.fromDate(endDate)),
        orderBy("timestamp")
      );
    } else {
      q = query(colRef, orderBy("timestamp"));
    }

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => doc.data());
      setHistory(data);
    });

    return () => unsub();
  }, [startDate, endDate, last3Hours]);

  /* --------------------------------------------------
     STATISTICS CALCULATION
  -------------------------------------------------- */
  const calcStats = (arr) => {
    if (!arr.length) return {};
    return {
      min: Math.min(...arr),
      max: Math.max(...arr),
      avg: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1),
    };
  };

  const stats = useMemo(
    () => ({
      temperature: calcStats(
        history.map((d) => d.sensors?.temperature).filter(Boolean)
      ),
      moisture: calcStats(
        history.map((d) => d.sensors?.moisture).filter(Boolean)
      ),
      pressure: calcStats(
        history.map((d) => d.sensors?.pressure).filter(Boolean)
      ),
    }),
    [history]
  );

  /* --------------------------------------------------
     CHART DATA
  -------------------------------------------------- */
  const chartData = {
    labels: history.map((d) => d.timestamp?.toDate().toLocaleTimeString()),
    datasets: [
      visible.temperature && {
        label: "Temperature (°C)",
        data: history.map((d) => d.sensors?.temperature ?? null),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.25)",
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: 0,
        yAxisID: "y",
      },
      visible.moisture && {
        label: "Soil Moisture (%)",
        data: history.map((d) => d.sensors?.moisture ?? null),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.25)",
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: 0,
        yAxisID: "y",
      },
      visible.pressure && {
        label: "Pressure (kPa)",
        data: history.map((d) => d.sensors?.pressure ?? null),
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.25)",
        fill: true,
        tension: 0.45,
        borderWidth: 3,
        pointRadius: 0,
        yAxisID: "y1",
      },
    ].filter(Boolean),
  };

  /* --------------------------------------------------
     CHART OPTIONS
  -------------------------------------------------- */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Plant Sensor Analytics" },
      zoom: {
        pan: { enabled: true, mode: "x" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
      y1: { position: "right", grid: { drawOnChartArea: false } },
    },
  };

  /* --------------------------------------------------
     CSV EXPORT
  -------------------------------------------------- */
  const exportCSV = () => {
    const headers = ["Timestamp"];
    if (visible.temperature) headers.push("Temperature");
    if (visible.moisture) headers.push("Moisture");
    if (visible.pressure) headers.push("Pressure");

    const rows = history.map((d) => {
      const row = [d.timestamp?.toDate().toLocaleString()];
      if (visible.temperature) row.push(d.sensors?.temperature ?? "");
      if (visible.moisture) row.push(d.sensors?.moisture ?? "");
      if (visible.pressure) row.push(d.sensors?.pressure ?? "");
      return row.join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    saveAs(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
      "plantpulse_data.csv"
    );
  };

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */
  return (
    <section className="section">
      <h2>Sensor Dashboard</h2>

      <div className="controls">
        <div className="toggles">
          {Object.keys(visible).map((k) => (
            <label key={k}>
              <input
                type="checkbox"
                checked={visible[k]}
                onChange={() => setVisible((v) => ({ ...v, [k]: !v[k] }))}
              />
              {k}
            </label>
          ))}

          <label>
            <input
              type="checkbox"
              checked={showStats}
              onChange={() => setShowStats(!showStats)}
            />
            Show Stats
          </label>

          <label>
            <input
              type="checkbox"
              checked={last3Hours}
              onChange={() => setLast3Hours(!last3Hours)}
            />
            Last 3 Hours
          </label>
        </div>

        <button onClick={exportCSV} className="csv-btn">
          📤 <span className="glow">Export CSV</span>
        </button>
      </div>

      {!last3Hours && (
        <div className="date-filters">
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
          />
          <DatePicker selected={endDate} onChange={setEndDate} showTimeSelect />
        </div>
      )}

      {showStats && (
        <div className="stats">
          <p>
            🌡 Temp → Min: {stats.temperature.min} | Max: {stats.temperature.max}{" "}
            | Avg: {stats.temperature.avg}
          </p>
          <p>
            💧 Moisture → Min: {stats.moisture.min} | Max: {stats.moisture.max}{" "}
            | Avg: {stats.moisture.avg}
          </p>
          <p>
            📈 Pressure → Min: {stats.pressure.min} | Max: {stats.pressure.max}{" "}
            | Avg: {stats.pressure.avg}
          </p>
        </div>
      )}

      <div className="chart-glow" style={{ height: 450 }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}
