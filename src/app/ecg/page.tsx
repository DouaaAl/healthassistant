"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./ecg.module.css";
import { ref, onValue, off } from "firebase/database";
import { database } from "../firebase/clientApp";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Page = () => {
  const [heartbeat, setHeartbeat] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("No Apparent sickness");
  const [history, setHistory] = useState<
    { time: string; average: number; status: string }[]
  >([]);

  const dataRef = useRef(ref(database, "heart"));
  const unsubscribeRef = useRef<any>(null);

  useEffect(() => {
    // Realtime listener (always on)
    unsubscribeRef.current = onValue(dataRef.current, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const formatted = Object.entries(value).map(([key, val]: any) => ({
          timestamp: Number(key),
          time: new Date(Number(key)).toLocaleTimeString(),
          bpm: val,
        }));
        setLiveData(formatted);
      } else {
        setLiveData([]);
      }
    });

    return () => {
      if (unsubscribeRef.current) off(dataRef.current);
    };
  }, []);

  const handleAnalyze = () => {
    if (!analyzing) {
      // Start analyzing → record start time
      setHeartbeat([]);
      setAnalysisResult("Analyzing...");
      setAnalyzing(true);
    } else {
      // Stop analyzing → filter data between start and stop
      const now = Date.now();

      // Filter last 10 seconds worth of data, or dynamically based on start time
      const filteredData = liveData.filter(
        (d) => d.timestamp >= analysisStart.current && d.timestamp <= now
      );

      setHeartbeat(filteredData);

      if (filteredData.length > 0) {
        const avg =
          filteredData.reduce((acc, cur) => acc + cur.bpm, 0) /
          filteredData.length;
        let status = "Normal heart rate";
        if (avg < 60) status = "Bradycardia (Low heart rate)";
        else if (avg > 100) status = "Tachycardia (High heart rate)";
        setAnalysisResult(status);

        setHistory((prev) => [
          ...prev,
          {
            time: new Date().toLocaleString(),
            average: parseFloat(avg.toFixed(1)),
            status,
          },
        ]);
      } else {
        setAnalysisResult("No data collected during this interval");
      }

      setAnalyzing(false);
    }
  };

  const analysisStart = useRef<number>(0);

  // Track when "Start" was pressed
  useEffect(() => {
    if (analyzing) {
      analysisStart.current = Date.now();
    }
  }, [analyzing]);

  return (
    <article className={styles.ecg}>
      <h1 className={styles.title}>
        <Image
          src={"/images/main/img1.png"}
          height={50}
          width={50}
          alt="heart"
        />
        ECG Checkup
      </h1>

      {/* REALTIME CHECKUP */}
      <article className={styles.checkup}>
        <div className={styles.flex}>
          <h2>Realtime Checkup</h2>
          <button
            className={analyzing ? styles.orange : styles.blue}
            onClick={handleAnalyze}
          >
            {analyzing ? "Stop Analyzing" : "Start Analyzing"}
          </button>
        </div>

        {/* Chart */}
        <div
          style={{
            width: "100%",
            height: "300px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginTop: "1rem",
          }}
        >
          {heartbeat.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                lineHeight: "300px",
                color: "#999",
              }}
            >
              {analyzing
                ? "Collecting heart rate data..."
                : "Press Start to analyze heart rate"}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartbeat}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  domain={[40, 180]}
                  label={{ value: "BPM", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={styles.flex}>
          <h4>
            <span>Result:</span> {analysisResult}
          </h4>
        </div>
      </article>

      {/* HISTORY */}
      <article className={styles.checkup}>
        <div className={styles.flex}>
          <h2>History Checkup</h2>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {history.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center" }}>
              No previous analyses
            </p>
          ) : (
            <table
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                padding: "10px",
              }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: "8px" }}>Time</th>
                  <th style={{ padding: "8px" }}>Average BPM</th>
                  <th style={{ padding: "8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px" }}>{h.time}</td>
                    <td style={{ padding: "8px" }}>{h.average}</td>
                    <td
                      style={{
                        padding: "8px",
                        color:
                          h.status.includes("Normal") ? "green" : "red",
                      }}
                    >
                      {h.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </article>
    </article>
  );
};

export default Page;
