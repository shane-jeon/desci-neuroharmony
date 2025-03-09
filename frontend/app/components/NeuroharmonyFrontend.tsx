"use client";
import React, { useEffect, useState } from "react";
import { fetchDatasets, uploadDataset, Dataset } from "../lib/web3";
import Modal from "./Modal";
import DataVisualizer from "./DataVisualizer";
import CollaborationPanel from "./CollaborationPanel";

type DatasetType = "ECG" | "EEG" | "EOG" | "ALL";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
}

const NeuroharmonyFrontend: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<DatasetType>("ALL");
  const [selectedDataset, setSelectedDataset] = useState<{
    dataset: Dataset;
    view: "visualize" | "collaborate";
  } | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const getDatasets = async () => {
        try {
          const data = await fetchDatasets();
          setDatasets(data);
        } catch (error) {
          console.error("Error fetching datasets:", error);
          setModal({
            isOpen: true,
            title: "Error",
            message: "Failed to fetch datasets. Please try again later.",
          });
        } finally {
          setIsLoading(false);
        }
      };
      getDatasets();
    }
  }, [mounted]);

  const handleUpload = async (dataset: Dataset) => {
    if (!mounted) return;
    setLoadingId(dataset.id);
    try {
      const result = await uploadDataset(
        dataset.id,
        dataset.source,
        "CC BY 4.0",
      );

      setModal({
        isOpen: true,
        title: result.success ? "Success" : "Error",
        message:
          result.message +
          (result.transactionHash
            ? `\nTransaction Hash: ${result.transactionHash}`
            : ""),
      });
    } catch (error) {
      console.error("Error uploading dataset:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const closeDatasetView = () => {
    setSelectedDataset(null);
  };

  const filteredDatasets = datasets.filter(
    (dataset) => activeFilter === "ALL" || dataset.dataType === activeFilter,
  );

  // Don't render anything until mounted
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-3xl font-bold">NeuroHarmony Datasets</div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-lg text-gray-600">Loading datasets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">NeuroHarmony Datasets</h1>
        <p className="text-gray-600">
          Secure, transparent, and collaborative neurophysiological data sharing
          platform
        </p>
      </div>

      {/* Data Type Filter */}
      <div className="mb-6 flex justify-center space-x-4">
        {(["ALL", "ECG", "EEG", "EOG"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`rounded-full px-4 py-2 ${
              activeFilter === type
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            {type}
          </button>
        ))}
      </div>

      {filteredDatasets.length === 0 ? (
        <p className="mt-6 text-center text-gray-600">No datasets available.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDatasets.map((dataset) => (
            <div key={dataset.id} className="rounded-lg border p-4 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{dataset.name}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    dataset.dataType === "ECG"
                      ? "bg-red-100 text-red-800"
                      : dataset.dataType === "EEG"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                  {dataset.dataType}
                </span>
              </div>
              <p className="text-gray-600">Source: {dataset.source}</p>
              <p className="mt-2">{dataset.description}</p>

              {/* Dataset Metadata */}
              <div className="mt-4 rounded-md bg-gray-50 p-3">
                <h3 className="mb-2 font-semibold">Dataset Details:</h3>
                <div className="text-sm text-gray-600">
                  {dataset.metadata.samplingRate && (
                    <p>Sampling Rate: {dataset.metadata.samplingRate} Hz</p>
                  )}
                  {dataset.metadata.channels && (
                    <p>Channels: {dataset.metadata.channels}</p>
                  )}
                  {dataset.metadata.duration && (
                    <p>Duration: {dataset.metadata.duration}s</p>
                  )}
                </div>
              </div>

              {/* Permissions Info */}
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-.994.89l-1 9A1 1 0 004 19h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 8h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm-3 1h10l.9 8H4.1l.9-8z"
                    clipRule="evenodd"
                  />
                </svg>
                {dataset.metadata.permissions.isPublic ? "Public" : "Private"}{" "}
                Dataset
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  className={`rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 ${
                    loadingId === dataset.id
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                  disabled={loadingId === dataset.id}
                  onClick={() => handleUpload(dataset)}>
                  {loadingId === dataset.id ? "Uploading..." : "Upload"}
                </button>
                <button
                  className="rounded bg-purple-500 px-4 py-2 text-white transition hover:bg-purple-600"
                  onClick={() =>
                    setSelectedDataset({ dataset, view: "visualize" })
                  }>
                  Visualize
                </button>
                <button
                  className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                  onClick={() =>
                    setSelectedDataset({ dataset, view: "collaborate" })
                  }>
                  Collaborate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
      />

      {selectedDataset?.view === "visualize" && (
        <DataVisualizer
          dataset={selectedDataset.dataset}
          onClose={closeDatasetView}
        />
      )}

      {selectedDataset?.view === "collaborate" && (
        <CollaborationPanel
          dataset={selectedDataset.dataset}
          onClose={closeDatasetView}
        />
      )}
    </div>
  );
};

export default NeuroharmonyFrontend;
