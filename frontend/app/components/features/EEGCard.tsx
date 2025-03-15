"use client";

import React, { useState, useEffect } from "react";
import { NeuroData } from "../../types/neuro";
import { fetchEEGData } from "../../services/neuroData";
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

interface EEGCardProps {
  subjectId?: string;
}

export const EEGCard: React.FC<EEGCardProps> = ({ subjectId }) => {
  const [data, setData] = useState<NeuroData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSubjects] = useState<string[]>([
    "001",
    "002",
    "003",
    "004",
    "005",
    "006",
    "007",
    "008",
    "009",
    "010",
    "088",
  ]);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjectId || "",
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSubject) return;

      setLoading(true);
      setError(null);
      try {
        console.log("Fetching EEG data for subject:", selectedSubject);
        const response = await fetchEEGData(selectedSubject);

        if (response?.success && response.data) {
          console.log("EEG data received:", {
            channels: response.data.channel_names.length,
            samplesPerChannel: response.data.data[0]?.length || 0,
            samplingRate: response.data.sampling_rate,
          });
          setData(response.data);
        } else {
          console.error("EEG data fetch failed:", response?.error);
          setError(response?.error || "Failed to fetch data");
        }
      } catch (error: unknown) {
        console.error("Error fetching EEG data:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError(
            "Cannot connect to server. Please ensure the backend server is running at http://localhost:5001",
          );
        } else {
          setError(
            `An error occurred while fetching data: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  const chartData = data
    ? {
        labels: Array.from(
          { length: data.data[0]?.length || 0 },
          (_, i) => i / 500,
        ), // Convert to seconds (500 Hz)
        datasets: data.data.map((channelData, index) => ({
          label: data.channel_names[index] || `Channel ${index + 1}`,
          data: channelData,
          borderColor: `hsl(${(360 / data.data.length) * index}, 70%, 50%)`,
          borderWidth: 1,
          pointRadius: 0,
        })),
      }
    : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "EEG Data Visualization",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y: {
        title: {
          display: true,
          text: data?.units || "Amplitude (µV)",
        },
      },
    },
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold">EEG Data Viewer</h2>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full rounded border p-2">
          <option value="">Select Subject</option>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>
              Subject {subject}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="flex h-64 items-center justify-center text-center text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && data && chartData && (
        <div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Sampling Rate:</strong> {data.sampling_rate} Hz
              </p>
              <p>
                <strong>Start Time:</strong> {data.start_time}
              </p>
            </div>
            <div>
              <p>
                <strong>Channels:</strong> {data.channel_names.length}
              </p>
              <p>
                <strong>Units:</strong> {data.units || "µV"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
