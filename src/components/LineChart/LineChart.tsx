"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface DataPoint {
  x: string; // ISO 8601 timestamp
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [filteredData, setFilteredData] = useState<DataPoint[]>(data);
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");

  useEffect(() => {
    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      const filtered = data.filter((point) => {
        const pointTime = new Date(point.x);
        return pointTime >= start && pointTime <= end;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [startDateTime, endDateTime, data]);

  const chartData: ChartData<"line", { x: number; y: number }[]> = {
    datasets: [
      {
        label: "Temperature (°C)",
        data: filteredData.map((point) => ({
          x: new Date(point.x).getTime(),
          y: point.y,
        })),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
          displayFormats: {
            second: "HH:mm:ss",
          },
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start DateTime:
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            style={{ marginLeft: "0.5rem", marginRight: "1rem" }}
          />
        </label>
        <label>
          End DateTime:
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
