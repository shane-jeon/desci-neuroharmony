"use client";

import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const ECGCard: React.FC = () => {
  // Generate mock ECG data
  const generateMockECGData = () => {
    const samplingRate = 500; // Hz
    const duration = 10; // seconds
    const numSamples = samplingRate * duration;
    const timePoints = Array.from(
      { length: numSamples },
      (_, i) => i / samplingRate,
    );

    // Generate a single heartbeat pattern
    const heartbeatPattern = (t: number) => {
      // P wave
      const p = Math.exp(-Math.pow(t - 0.1, 2) / 0.001) * 0.25;
      // QRS complex
      const qrs =
        Math.exp(-Math.pow(t - 0.2, 2) / 0.0001) * 1.5 -
        Math.exp(-Math.pow(t - 0.15, 2) / 0.0001) * 0.5;
      // T wave
      const t_wave = Math.exp(-Math.pow(t - 0.3, 2) / 0.002) * 0.35;

      return p + qrs + t_wave;
    };

    // Generate ECG signal by repeating the heartbeat pattern
    const heartRate = 60; // beats per minute
    const beatInterval = 60 / heartRate; // seconds
    const data = timePoints.map((t) => {
      const tMod = t % beatInterval;
      return heartbeatPattern(tMod) + Math.random() * 0.05; // Add some noise
    });

    return {
      data,
      timePoints,
      samplingRate,
    };
  };

  const mockData = generateMockECGData();

  const chartData = {
    labels: mockData.timePoints,
    datasets: [
      {
        label: "ECG Lead II",
        data: mockData.data,
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "ECG Data Visualization",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amplitude (mV)",
        },
      },
    },
    animation: {
      duration: 0, // Disable animation for better performance
    },
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold">ECG Data Viewer</h2>
        <div className="rounded border bg-gray-50 p-2 text-sm text-gray-600">
          Simulated ECG Data - Lead II
        </div>
      </div>

      <div>
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p>
              <strong>Sampling Rate:</strong> {mockData.samplingRate} Hz
            </p>
            <p>
              <strong>Heart Rate:</strong> 60 BPM
            </p>
          </div>
          <div>
            <p>
              <strong>Duration:</strong> 10 seconds
            </p>
            <p>
              <strong>Lead:</strong> II
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
