"use client";
import React, { useState, useEffect } from "react";
import { Dataset } from "../lib/web3";

interface DataVisualizerProps {
  dataset: Dataset & {
    data?: {
      times?: number[];
      signals?: number[][];
    };
  };
  onClose: () => void;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({
  dataset,
  onClose,
}) => {
  const [visualizationData, setVisualizationData] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dataset) {
      fetchVisualizationData();
    }
  }, [dataset]);

  const fetchVisualizationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5000/api/python/visualize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dataType: dataset.dataType,
            data: dataset.data,
            metadata: dataset.metadata,
          }),
        },
      );

      const result = await response.json();
      if (result.success) {
        setVisualizationData(result.result);
      } else {
        setError(result.error || "Failed to visualize data");
      }
    } catch (error) {
      setError("Failed to connect to visualization service");
      console.error("Visualization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVisualizationType = () => {
    if (loading) {
      return (
        <div className="h-64 w-full bg-black p-4">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-lg text-white">Loading visualization...</div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-64 w-full bg-black p-4">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-lg text-red-500">{error}</div>
          </div>
        </div>
      );
    }

    if (visualizationData) {
      return (
        <div className="h-64 w-full bg-black p-4">
          <div className="flex h-full w-full items-center justify-center">
            <img
              src={`data:image/png;base64,${visualizationData}`}
              alt="EEG Visualization"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="h-64 w-full bg-black p-4">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-lg text-gray-500">
            No visualization data available
          </div>
        </div>
      </div>
    );
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/python/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataType: dataset.dataType,
          data: dataset.data,
          metadata: dataset.metadata,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setVisualizationData(result.result);
        console.log("Frequency bands:", result.bands);
      } else {
        setError(result.error || "Failed to perform frequency analysis");
      }
    } catch (error) {
      setError("Failed to perform frequency analysis");
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/python/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataType: dataset.dataType,
          data: dataset.data,
          metadata: dataset.metadata,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Create and download the file
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError(result.error || "Failed to export data");
      }
    } catch (error) {
      setError("Failed to export data");
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{dataset.name} Visualization</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {getVisualizationType()}

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Technical Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Sampling Rate: {dataset.metadata.samplingRate} Hz</p>
              <p>Channels: {dataset.metadata.channels}</p>
              <p>Duration: {dataset.metadata.duration}s</p>
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 font-semibold">Analysis Tools</h3>
            <div className="space-y-2">
              <button
                className="w-full rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
                onClick={runAnalysis}
                disabled={loading}>
                {loading ? "Running Analysis..." : "Run Frequency Analysis"}
              </button>
              <button
                className="w-full rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 disabled:bg-gray-400"
                onClick={exportData}
                disabled={loading}>
                {loading ? "Exporting..." : "Export Data"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
