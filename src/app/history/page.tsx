"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase/clientApp";
import styles from "./history.module.css";

type HealthData = {
  timestamp: number;
  value: number;
  time: string;
};

type HealthHistory = {
  timestamp: number;
  average: number;
  status: string;
  time: string;
};

const HistoryCheckups = () => {
  const [ecgData, setEcgData] = useState<HealthData[]>([]);
  const [oxyData, setOxyData] = useState<HealthData[]>([]);

  const [filter, setFilter] = useState({
    year: "",
    month: "",
    day: "",
    hour: "",
  });

  const [ecgHistory, setEcgHistory] = useState<HealthHistory[]>([]);
  const [oxyHistory, setOxyHistory] = useState<HealthHistory[]>([]);

  const [filteredEcg, setFilteredEcg] = useState<HealthHistory[]>([]);
  const [filteredOxy, setFilteredOxy] = useState<HealthHistory[]>([]);

  const [avgFilteredEcg, setAvgFilteredEcg] = useState<number | null>(null);
  const [avgFilteredOxy, setAvgFilteredOxy] = useState<number | null>(null);
  const [avgAllEcg, setAvgAllEcg] = useState<number | null>(null);
  const [avgAllOxy, setAvgAllOxy] = useState<number | null>(null);

  // Load data from Firebase
  useEffect(() => {
    const ecgRef = ref(database, "heart");
    const oxyRef = ref(database, "oxygene");

    const unsubscribeEcg = onValue(ecgRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const formatted = Object.entries(value).map(([key, val]: any) => ({
          timestamp: Number(key),
          value: val,
          time: new Date(Number(key)).toLocaleString(),
        }));
        setEcgData(formatted);
      }
    });

    const unsubscribeOxy = onValue(oxyRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const formatted = Object.entries(value).map(([key, val]: any) => ({
          timestamp: Number(key),
          value: val,
          time: new Date(Number(key)).toLocaleString(),
        }));
        setOxyData(formatted);
      }
    });

    return () => {
      off(ecgRef);
      off(oxyRef);
    };
  }, []);

  // Build history with statuses
  useEffect(() => {
    const buildHistory = (data: HealthData[], type: "ecg" | "oxy") =>
      data.map((d) => {
        let status = "Normal";
        if (type === "ecg") {
          if (d.value < 60) status = "Bradycardia";
          else if (d.value > 100) status = "Tachycardia";
        } else {
          if (d.value < 90) status = "Low O₂";
          else if (d.value > 100) status = "High O₂";
        }
        return { timestamp: d.timestamp, average: d.value, status, time: d.time };
      });

    setEcgHistory(buildHistory(ecgData, "ecg"));
    setOxyHistory(buildHistory(oxyData, "oxy"));
  }, [ecgData, oxyData]);

  // Filter history
  useEffect(() => {
    const filterData = (history: HealthHistory[]) => {
      let filtered = history;
      if (filter.year)
        filtered = filtered.filter(
          (h) => new Date(h.timestamp).getFullYear().toString() === filter.year
        );
      if (filter.month)
        filtered = filtered.filter(
          (h) => new Date(h.timestamp).getMonth() + 1 === Number(filter.month)
        );
      if (filter.day)
        filtered = filtered.filter(
          (h) => new Date(h.timestamp).getDate() === Number(filter.day)
        );
      if (filter.hour)
        filtered = filtered.filter(
          (h) => new Date(h.timestamp).getHours() === Number(filter.hour)
        );
      return filtered;
    };

    const fe = filterData(ecgHistory);
    const fo = filterData(oxyHistory);

    setFilteredEcg(fe);
    setFilteredOxy(fo);

    setAvgFilteredEcg(
      fe.length > 0 ? parseFloat((fe.reduce((a, c) => a + c.average, 0) / fe.length).toFixed(1)) : null
    );
    setAvgFilteredOxy(
      fo.length > 0 ? parseFloat((fo.reduce((a, c) => a + c.average, 0) / fo.length).toFixed(1)) : null
    );

    setAvgAllEcg(
      ecgHistory.length > 0
        ? parseFloat((ecgHistory.reduce((a, c) => a + c.average, 0) / ecgHistory.length).toFixed(1))
        : null
    );
    setAvgAllOxy(
      oxyHistory.length > 0
        ? parseFloat((oxyHistory.reduce((a, c) => a + c.average, 0) / oxyHistory.length).toFixed(1))
        : null
    );
  }, [filter, ecgHistory, oxyHistory]);

  return (
    <article className={styles.history}>
      <h1 className={styles.title}>History Checkups</h1>

      {/* Filters */}
      <div className={styles.filter}>
        <input
          type="number"
          placeholder="Year"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
        />
        <input
          type="number"
          placeholder="Month"
          min={1}
          max={12}
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
        />
        <input
          type="number"
          placeholder="Day"
          min={1}
          max={31}
          value={filter.day}
          onChange={(e) => setFilter({ ...filter, day: e.target.value })}
        />
        <input
          type="number"
          placeholder="Hour"
          min={0}
          max={23}
          value={filter.hour}
          onChange={(e) => setFilter({ ...filter, hour: e.target.value })}
        />
      </div>

      {/* Averages */}
      <div className={styles.averages}>
        {avgFilteredEcg !== null && <p>Average ECG (filtered): {avgFilteredEcg} bpm</p>}
        {avgFilteredOxy !== null && <p>Average Oxygen (filtered): {avgFilteredOxy}%</p>}
        {avgAllEcg !== null && <p>Average ECG (all-time): {avgAllEcg} bpm</p>}
        {avgAllOxy !== null && <p>Average Oxygen (all-time): {avgAllOxy}%</p>}
      </div>

      {/* ECG Table */}
      <div className={styles.historySection}>
        <h2>ECG History</h2>
        {filteredEcg.length === 0 ? (
          <p>No ECG data for this filter</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>BPM</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEcg.map((h, i) => (
                <tr key={i}>
                  <td>{h.time}</td>
                  <td>{h.average}</td>
                  <td style={{ color: h.status === "Normal" ? "green" : "red" }}>
                    {h.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Oxygen Table */}
      <div className={styles.historySection}>
        <h2>Oxygen History</h2>
        {filteredOxy.length === 0 ? (
          <p>No Oxygen data for this filter</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>O₂ (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOxy.map((h, i) => (
                <tr key={i}>
                  <td>{h.time}</td>
                  <td>{h.average}</td>
                  <td style={{ color: h.status === "Normal" ? "green" : "red" }}>
                    {h.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </article>
  );
};

export default HistoryCheckups;
