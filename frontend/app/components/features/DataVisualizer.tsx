"use client";
import React from "react";
import { Dataset } from "../../lib/web3";
import NeuroDataCard from "./NeuroDataCard";

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

        <div className="mb-4">
          <NeuroDataCard
            type={dataset.dataType.toLowerCase() as "eeg" | "eog"}
            subjectId={dataset.metadata.subjectId}
            version={dataset.metadata.version}
            participant={dataset.metadata.participant}
            session={dataset.metadata.session}
          />
        </div>

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
            <h3 className="mb-2 font-semibold">Dataset Information</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Type: {dataset.dataType}</p>
              <p>Source: {dataset.source}</p>
              <p>
                Access:{" "}
                {dataset.metadata.permissions?.isPublic ? "Public" : "Private"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizer;
