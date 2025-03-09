"use client";
import React, { useState } from "react";
import { Dataset } from "../lib/web3";

interface CollaborationPanelProps {
  dataset: Dataset;
  onClose: () => void;
}

interface ResearchRequest {
  researcherId: string;
  name: string;
  institution: string;
  purpose: string;
  status: "pending" | "approved" | "rejected";
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  dataset,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "requests" | "researchers" | "settings"
  >("requests");

  // Mock data - in a real implementation, these would come from the blockchain
  const [requests] = useState<ResearchRequest[]>([
    {
      researcherId: "1",
      name: "Dr. Sarah Johnson",
      institution: "Neuroscience Institute",
      purpose: "Analyzing sleep patterns in EEG data",
      status: "pending",
    },
    {
      researcherId: "2",
      name: "Prof. Michael Chen",
      institution: "Brain Research Center",
      purpose: "Comparative study of ECG patterns",
      status: "approved",
    },
  ]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "requests":
        return (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.researcherId} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{request.name}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{request.institution}</p>
                <p className="mt-2 text-sm">{request.purpose}</p>
                {request.status === "pending" && (
                  <div className="mt-3 flex space-x-2">
                    <button className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600">
                      Approve
                    </button>
                    <button className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "researchers":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Current Collaborators</h3>
              <div className="space-y-2">
                {dataset.metadata.permissions.authorizedResearchers.map(
                  (researcher) => (
                    <div
                      key={researcher}
                      className="flex items-center justify-between rounded bg-gray-50 p-2">
                      <span>{researcher}</span>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Invite Researcher</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Researcher's Wallet Address"
                  className="w-full rounded-md border p-2"
                />
                <button className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Sharing Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      dataset.metadata.permissions.sharingPreferences
                        .allowAnalysis
                    }
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={() => {}}
                  />
                  <span>Allow Data Analysis</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      dataset.metadata.permissions.sharingPreferences
                        .allowSharing
                    }
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={() => {}}
                  />
                  <span>Allow Data Sharing</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={
                      dataset.metadata.permissions.sharingPreferences
                        .requiresConsent
                    }
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={() => {}}
                  />
                  <span>Require Consent for Each Use</span>
                </label>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Dataset Visibility</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dataset.metadata.permissions.isPublic}
                  className="h-4 w-4 rounded border-gray-300"
                  onChange={() => {}}
                />
                <span>Make Dataset Public</span>
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Collaboration Settings</h2>
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

        <div className="mb-6 flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "requests"
                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("requests")}>
            Access Requests
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "researchers"
                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("researchers")}>
            Researchers
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "settings"
                ? "border-b-2 border-blue-500 font-semibold text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("settings")}>
            Settings
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default CollaborationPanel;
