"use client";
import React from "react";
import { Dataset } from "../lib/web3";

interface DataVisualizerProps {
  dataset: Dataset;
  onClose: () => void;
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({
  dataset,
  onClose,
}) => {
  const getVisualizationType = () => {
    switch (dataset.dataType) {
      case "ECG":
        return (
          <div className="h-64 w-full bg-black p-4">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-lg text-green-500">
                ECG Visualization Placeholder
                {/* In a real implementation, we would use a library like Chart.js or D3.js */}
              </div>
            </div>
          </div>
        );
      case "EEG":
        return (
          <div className="h-64 w-full bg-black p-4">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-lg text-blue-500">
                EEG Visualization Placeholder
                {/* In a real implementation, we would use a specialized EEG visualization library */}
              </div>
            </div>
          </div>
        );
      case "EOG":
        return (
          <div className="h-64 w-full bg-black p-4">
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-lg text-purple-500">
                EOG Visualization Placeholder
                {/* In a real implementation, we would use eye movement tracking visualization */}
              </div>
            </div>
          </div>
        );
      default:
        return null;
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
              <button className="w-full rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                Run Frequency Analysis
              </button>
              <button className="w-full rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
