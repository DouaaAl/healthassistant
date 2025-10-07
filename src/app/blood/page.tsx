"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./blood.module.css";
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
  const [oxygenData, setOxygenData] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("No Apparent sickness");
  const [history, setHistory] = useState<
    { time: string; average: number; status: string }[]
  >([]);

  const dataRef = useRef(ref(database, "oxygene"));
  const unsubscribeRef = useRef<any>(null);

  const analysisStart = useRef<number>(0);

  useEffect(() => {
    // Realtime listener
    unsubscribeRef.current = onValue(dataRef.current, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        console.log("New data received from Firebase:", value); // <-- check here
        const formatted = Object.entries(value).map(([key, val]: any) => ({
          timestamp: Number(key),
          time: new Date(Number(key)).toLocaleTimeString(),
          oxygen: val,
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
      // Start analyzing
      setOxygenData([]);
      setAnalysisResult("Analyzing...");
      setAnalyzing(true);
      analysisStart.current = Date.now();
    } else {
      // Stop analyzing
      const now = Date.now();
      const filteredData = liveData.filter(
        (d) => d.timestamp >= analysisStart.current && d.timestamp <= now
      );
      setOxygenData(filteredData);

      if (filteredData.length > 0) {
        const avg =
          filteredData.reduce((acc, cur) => acc + cur.oxygen, 0) /
          filteredData.length;
        let status = "Normal oxygen level";
        if (avg < 90) status = "Low oxygen level";
        else if (avg > 100) status = "Above normal oxygen";

        setAnalysisResult(status);

        setHistory((prev) => [
          ...prev,
          { time: new Date().toLocaleString(), average: parseFloat(avg.toFixed(1)), status },
        ]);
      } else {
        setAnalysisResult("No data collected during this interval");
      }

      setAnalyzing(false);
    }
  };

  return (
    <article className={styles.blood}>
      <h1 className={styles.title}>
        <Image
          src={"/images/main/img2.png"}
          height={50}
          width={50}
          alt="oxygen"
        />
        Blood Oxygene
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
          {oxygenData.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                lineHeight: "300px",
                color: "#999",
              }}
            >
              {analyzing
                ? "Collecting oxygen data..."
                : "Press Start to analyze oxygen level"}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={oxygenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis
                  domain={[40, 105]}
                  label={{ value: "O₂ (%)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="oxygen"
                  stroke="#4da6ff"
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
                  <th style={{ padding: "8px" }}>Average O₂</th>
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
