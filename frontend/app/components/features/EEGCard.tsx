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

  // List of subjects from OpenNeuro dataset ds004504
  // Includes Alzheimer's, frontotemporal dementia, and control subjects
  const [availableSubjects] = useState<string[]>([
    "001", // AD patient
    "002", // AD patient
    "003", // FTD patient
    "004", // Control
    "005", // AD patient
    "006", // FTD patient
    "007", // Control
    "008", // AD patient
    "009", // FTD patient
    "010", // Control
    "088", // Control
  ]);

  const [selectedSubject, setSelectedSubject] = useState<string>(
    subjectId || "",
  );

  // Fetch EEG data when subject selection changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSubject) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetchEEGData(selectedSubject);

        if (response?.success && response.data) {
          setData(response.data);
        } else {
          setError(response?.error || "Failed to fetch data");
        }
      } catch (error: unknown) {
        // Provide user-friendly error messages
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

  // Transform raw EEG data into Chart.js format
  // Data is sampled at 500Hz, so we convert indices to seconds
  const chartData = data
    ? {
        labels: Array.from(
          { length: data.data[0]?.length || 0 },
          (_, i) => i / 500,
        ),
        datasets: data.data.map((channelData, index) => ({
          label: data.channel_names[index] || `Channel ${index + 1}`,
          data: channelData,
          borderColor: `hsl(${(360 / data.data.length) * index}, 70%, 50%)`, // Unique color per channel
          borderWidth: 1,
          pointRadius: 0, // Hide points for better performance with large datasets
        })),
      }
    : null;

  // Configure chart for optimal EEG visualization
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
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4">
        <label
          htmlFor="subject-select"
          className="block text-sm font-medium text-gray-700">
          Select Subject
        </label>
        <select
          id="subject-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
          <option value="">Select a subject...</option>
          {availableSubjects.map((subject) => (
            <option key={subject} value={subject}>
              Subject {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Display loading state */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Display error message if any */}
      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Render EEG chart when data is available */}
      {!loading && !error && chartData && chartOptions && (
        <div className="h-[500px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Display metadata when data is available */}
      {data && (
        <div className="mt-4 text-sm text-gray-600">
          <p>Sampling Rate: {data.sampling_rate} Hz</p>
          <p>Number of Channels: {data.channel_names.length}</p>
          <p>
            Duration: {(data.data[0]?.length || 0) / data.sampling_rate} seconds
          </p>
        </div>
      )}
    </div>
  );
};

export default EEGCard;
