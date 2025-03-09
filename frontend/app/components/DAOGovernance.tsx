"use client";

import React, { useState, useEffect } from "react";
import { neuroGrantDAO } from "../lib/web3";
import Web3 from "web3";
import Modal from "./Modal";
import { AbiItem } from "web3-utils";

interface Proposal {
  id: number;
  description: string;
  budget: string;
  proposer: string;
  isExecuted: boolean;
  votes: number;
}

interface ProposalResponse {
  description: string;
  budget: string;
  proposer: string;
  isExecuted: boolean;
  votes: string;
}

interface DAOGovernanceProps {
  web3: Web3;
  account: string;
}

const DAOGovernance: React.FC<DAOGovernanceProps> = ({ web3, account }) => {
  const [mounted, setMounted] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState({
    description: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    description: "",
    budget: "",
  });
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && web3 && account) {
      fetchProposals();
    }
  }, [mounted, web3, account]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      const proposalCount = await contract.methods.proposalCount().call();
      const count = Number(proposalCount);

      const fetchedProposals: Proposal[] = [];
      for (let i = 1; i <= count; i++) {
        const proposal: ProposalResponse = await contract.methods
          .proposals(i)
          .call();
        fetchedProposals.push({
          id: i,
          description: proposal.description,
          budget: web3.utils.fromWei(proposal.budget, "ether"),
          proposer: proposal.proposer,
          isExecuted: proposal.isExecuted,
          votes: Number(proposal.votes),
        });
      }
      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      showModal(
        "Error",
        "Failed to fetch proposals. Please check your network connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      description: "",
      budget: "",
    };
    let isValid = true;

    if (!newProposal.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!newProposal.budget) {
      errors.budget = "Budget is required";
      isValid = false;
    } else if (parseFloat(newProposal.budget) <= 0) {
      errors.budget = "Budget must be greater than 0";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const createProposal = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi,
        neuroGrantDAO.address,
      );

      const budgetInWei = web3.utils.toWei(newProposal.budget, "ether");
      await contract.methods
        .createProposal(newProposal.description, budgetInWei)
        .send({ from: account });

      await fetchProposals();
      setNewProposal({ description: "", budget: "" });
      setFormErrors({ description: "", budget: "" });
      showModal("Success", "Proposal created successfully!");
    } catch (error) {
      console.error("Error creating proposal:", error);
      showModal("Error", "Failed to create proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const voteForProposal = async (proposalId: number) => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi,
        neuroGrantDAO.address,
      );

      await contract.methods
        .voteForProposal(proposalId)
        .send({ from: account });
      await fetchProposals();
      showModal("Success", "Vote cast successfully!");
    } catch (error) {
      console.error("Error voting for proposal:", error);
      showModal("Error", "Failed to cast vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = async (proposalId: number) => {
    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi,
        neuroGrantDAO.address,
      );

      await contract.methods
        .executeProposal(proposalId)
        .send({ from: account });
      await fetchProposals();
      showModal("Success", "Proposal executed successfully!");
    } catch (error) {
      console.error("Error executing proposal:", error);
      showModal("Error", "Failed to execute proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (title: string, message: string) => {
    setModal({
      isOpen: true,
      title,
      message,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold">NeuroHarmony DAO Governance</h2>

      {/* Create New Proposal */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-xl font-semibold">Create New Proposal</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Proposal Description
            </label>
            <textarea
              placeholder="Enter a detailed description of your proposal..."
              value={newProposal.description}
              onChange={(e) => {
                setNewProposal({ ...newProposal, description: e.target.value });
                if (formErrors.description) {
                  setFormErrors({ ...formErrors, description: "" });
                }
              }}
              className={`w-full rounded border p-2 ${
                formErrors.description ? "border-red-500" : ""
              }`}
              rows={3}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">
                {formErrors.description}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Budget (ETH)
            </label>
            <input
              type="number"
              placeholder="Enter the required budget in ETH"
              value={newProposal.budget}
              onChange={(e) => {
                setNewProposal({ ...newProposal, budget: e.target.value });
                if (formErrors.budget) {
                  setFormErrors({ ...formErrors, budget: "" });
                }
              }}
              className={`w-full rounded border p-2 ${
                formErrors.budget ? "border-red-500" : ""
              }`}
              step="0.01"
              min="0"
            />
            {formErrors.budget && (
              <p className="mt-1 text-sm text-red-500">{formErrors.budget}</p>
            )}
          </div>
          <button
            onClick={createProposal}
            disabled={loading}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-2 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Proposal...
              </div>
            ) : (
              "Create Proposal"
            )}
          </button>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {loading && proposals.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-lg bg-white">
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading proposals...</p>
            </div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No proposals yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create the first proposal to get started!
            </p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} className="rounded-lg bg-white p-4 shadow">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Proposal #{proposal.id}
                  </h3>
                  <p className="mt-2 text-gray-600">{proposal.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      Budget: {proposal.budget} ETH
                    </p>
                    <p className="text-sm text-gray-500">
                      Proposer: {proposal.proposer}
                    </p>
                    <p className="text-sm text-gray-500">
                      Votes: {proposal.votes}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`rounded px-2 py-1 text-sm ${
                        proposal.isExecuted
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {proposal.isExecuted ? "Executed" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {!proposal.isExecuted && (
                    <>
                      <button
                        onClick={() => voteForProposal(proposal.id)}
                        disabled={loading}
                        className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400">
                        Vote
                      </button>
                      <button
                        onClick={() => executeProposal(proposal.id)}
                        disabled={loading}
                        className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400">
                        Execute
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default DAOGovernance;
