"use client";

import React, { useState, useEffect } from "react";
import { NeuroData } from "../../types/neuro";
import { fetchEOGData } from "../../services/neuroData";
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

interface EOGCardProps {
  initialVersion?: string;
}

// Define valid day and version types to ensure data integrity
type DayKey = "d01" | "d02" | "d03";
type VersionKey =
  | "v01"
  | "v02"
  | "v03"
  | "v04"
  | "v05"
  | "v06"
  | "v07"
  | "v08"
  | "v09"
  | "v10";

export const EOGCard: React.FC<EOGCardProps> = ({ initialVersion }) => {
  const [data, setData] = useState<NeuroData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>(
    initialVersion || "",
  );
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedBlock, setSelectedBlock] = useState<string>("");

  // This maps the actual structure of the Tübingen dataset
  // Each day contains multiple blocks of recordings
  // Only v01-v03 contain valid EOG data
  const blocks: Record<DayKey, Partial<Record<VersionKey, string[]>>> = {
    d01: {
      v01: ["b03", "b04fb1", "b05fb2", "b06fb3Correct"],
      v02: ["b01", "b02", "b03", "b04", "b05"],
      v03: ["b01", "b02", "b03"],
    },
    d02: {
      v01: ["b01", "b02fb2"],
      v02: ["b01", "b02", "b03", "b04"],
      v03: ["b01", "b02", "b03", "b04", "b05"],
    },
    d03: {
      v01: ["b01fb1", "b02fb2", "b03open1", "b04open2"],
      v02: ["b02", "b03", "b04", "b05"],
      v03: ["b01", "b02", "b02bis", "b03", "b04", "b05", "b06", "b07"],
    },
  };

  // Only v01-v03 contain valid EOG recordings
  const versions = ["v01", "v02", "v03"];
  const days = ["d01", "d02", "d03"];

  // Reset selections when version changes to prevent invalid combinations
  useEffect(() => {
    setSelectedBlock("");
    setSelectedDay("");
  }, [selectedVersion]);

  useEffect(() => {
    setSelectedBlock("");
  }, [selectedDay]);

  // Fetch EOG data whenever selection changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedVersion) return;

      setLoading(true);
      setError(null);
      try {
        // Default to first session if none selected
        const session =
          selectedDay && selectedBlock
            ? `${selectedDay}_${selectedBlock}`
            : "d01_b03";

        const response = await fetchEOGData(selectedVersion, "p11", session);

        if (response?.success && response.data) {
          setData(response.data);

          // Set default selections for first load
          if (!selectedDay && !selectedBlock) {
            setSelectedDay("d01");
            setSelectedBlock("b03");
          }
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
  }, [selectedVersion, selectedDay, selectedBlock]);

  // Transform raw data into Chart.js format
  // We convert the time axis to seconds and color-code channels
  const chartData = data
    ? {
        labels: Array.from(
          { length: data.data[0]?.length || 0 },
          (_, i) => i / 500,
        ), // Convert to seconds (500 Hz sampling rate)
        datasets: data.data.map((channelData, index) => ({
          label: data.channel_names[index] || `Channel ${index + 1}`,
          data: channelData,
          borderColor: `hsl(${(360 / data.data.length) * index}, 70%, 50%)`,
          borderWidth: 1,
          pointRadius: 0,
          hidden: !data.channel_names[index]?.startsWith("EOG"), // Focus on EOG channels
        })),
      }
    : null;

  // Chart configuration for optimal EOG visualization
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "EOG Data Visualization",
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
        <h2 className="mb-2 text-2xl font-bold">EOG Data Viewer</h2>
        <div className="space-y-2">
          <div className="rounded border bg-gray-50 p-2 text-sm text-gray-600">
            Source: University of Tübingen EOG Dataset
          </div>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="w-full rounded border p-2">
            <option value="">Select Version</option>
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <div className="rounded border bg-gray-50 p-2 text-sm text-gray-600">
            Participant: p11
          </div>
          {selectedVersion && (
            <>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full rounded border p-2">
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    Day {day.substring(1)}
                  </option>
                ))}
              </select>
              {selectedDay && (
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="w-full rounded border p-2">
                  <option value="">Select Block</option>
                  {blocks[selectedDay as DayKey]?.[
                    selectedVersion as VersionKey
                  ]?.map((block: string) => (
                    <option key={block} value={block}>
                      {block}
                    </option>
                  )) || []}
                </select>
              )}
            </>
          )}
        </div>
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
