"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { neuroGrantDAO, neuroToken } from "../../lib/web3";
import Web3 from "web3";
import Modal from "../shared/Modal";
import { AbiItem } from "web3-utils";
import { useVotingPower } from "../../contexts/VotingPowerContext";

interface Proposal {
  id: number;
  description: string;
  budget: string;
  proposer: string;
  isExecuted: boolean;
  votes: number;
}

interface ContractProposal {
  id: string;
  description: string;
  budget: string;
  votes: string;
  proposer: string;
  executed: boolean;
}

interface DAOGovernanceProps {
  web3: Web3 | null;
  account: string | null;
  showModal: (title: string, message: string) => void;
}

interface LoadingStates {
  fetchingProposals: boolean;
  creatingProposal: boolean;
  voting: { [proposalId: number]: boolean };
  executing: boolean;
  fetchingVotingPower: boolean;
}

const DAOGovernance: React.FC<DAOGovernanceProps> = ({
  web3,
  account,
  showModal,
}): ReactNode => {
  const [mounted, setMounted] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { votingPower, updateVotingPower } = useVotingPower();
  const [newProposal, setNewProposal] = useState({
    description: "",
    budget: "",
  });
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    fetchingProposals: false,
    creatingProposal: false,
    voting: {},
    executing: false,
    fetchingVotingPower: false,
  });
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

  // Update useEffect to use the context
  useEffect(() => {
    if (mounted && web3 && account) {
      updateVotingPower(web3, account);
    }
  }, [mounted, web3, account]);

  const fetchProposals = async () => {
    if (!web3) {
      return;
    }

    try {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        fetchingProposals: true,
      }));
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      const proposalCount = await contract.methods.proposalCount().call();
      const count = Number(proposalCount);

      const fetchedProposals: Proposal[] = [];
      if (count > 0) {
        for (let i = 1; i <= count; i++) {
          try {
            const proposal = (await contract.methods
              .proposals(i)
              .call()) as ContractProposal;

            if (!proposal) continue;

            fetchedProposals.push({
              id: Number(proposal.id),
              description: proposal.description,
              budget: web3.utils.fromWei(proposal.budget, "ether"),
              proposer: proposal.proposer,
              isExecuted: proposal.executed,
              votes: Number(proposal.votes),
            });
          } catch (error) {
            console.error(`Error fetching proposal ${i}:`, error);
          }
        }
      }
      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setProposals([]);
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        fetchingProposals: false,
      }));
    }
  };

  // Add useEffect to fetch proposals on mount and when web3 changes
  useEffect(() => {
    if (mounted && web3) {
      fetchProposals();
    }
  }, [mounted, web3]);

  const handleRefreshProposals = () => {
    if (web3) {
      fetchProposals();
    } else {
      setModal({
        isOpen: true,
        title: "Wallet Required",
        message: "Please connect your wallet to view proposals.",
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProposal();
  };

  const createProposal = async () => {
    if (!web3 || !account || !validateForm()) {
      return;
    }

    try {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        creatingProposal: true,
      }));
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      const budgetInWei = web3.utils.toWei(newProposal.budget, "ether");
      await contract.methods
        .createProposal(newProposal.description, budgetInWei)
        .send({ from: account });

      await fetchProposals();
      setNewProposal({ description: "", budget: "" });
      setFormErrors({ description: "", budget: "" });
      setModal({
        isOpen: true,
        title: "Success",
        message: "Proposal created successfully!",
      });
    } catch (error) {
      console.error("Error creating proposal:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Failed to create proposal. Please try again.",
      });
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        creatingProposal: false,
      }));
    }
  };

  const handleVote = async (proposalId: number) => {
    if (!web3 || !account) {
      setModal({
        isOpen: true,
        title: "Wallet Required",
        message: "Please connect your wallet to vote.",
      });
      return;
    }

    try {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        voting: { ...prev.voting, [proposalId]: true },
      }));

      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      // Check if user has already voted
      const hasVoted = (await contract.methods
        .hasUserVoted(proposalId, account)
        .call()) as boolean;
      if (hasVoted) {
        setModal({
          isOpen: true,
          title: "Already Voted",
          message: "You have already voted on this proposal.",
        });
        return;
      }

      // Get current voting power from staked tokens
      const neuroTokenContract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );
      const stakedAmount = (await neuroTokenContract.methods
        .getStakedAmount(account)
        .call()) as string;

      if (BigInt(stakedAmount) === BigInt(0)) {
        setModal({
          isOpen: true,
          title: "No Voting Power",
          message: "You need to stake tokens to vote on proposals.",
        });
        return;
      }

      // Convert 0.1 ETH to Wei for voting
      const fixedVoteAmount = web3.utils.toWei("0.1", "ether");

      // Cast vote with fixed amount
      await contract.methods
        .vote(proposalId, fixedVoteAmount)
        .send({ from: account });

      // Update voting power using the context
      await updateVotingPower(web3, account);

      await fetchProposals();
      setModal({
        isOpen: true,
        title: "Success",
        message: "Vote cast successfully with 0.1 NEURO!",
      });
    } catch (error) {
      console.error("Error voting:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Failed to cast vote. Please try again.",
      });
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        voting: { ...prev.voting, [proposalId]: false },
      }));
    }
  };

  const handleExecuteProposal = async (proposalId: number) => {
    if (!web3 || !account) {
      setModal({
        isOpen: true,
        title: "Wallet Required",
        message: "Please connect your wallet to execute proposals.",
      });
      return;
    }

    try {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        executing: true,
      }));

      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      await contract.methods
        .executeProposal(proposalId)
        .send({ from: account });

      await fetchProposals();
      setModal({
        isOpen: true,
        title: "Success",
        message: "Proposal executed successfully!",
      });
    } catch (error) {
      console.error("Error executing proposal:", error);
      setModal({
        isOpen: true,
        title: "Error",
        message: "Failed to execute proposal. Please try again.",
      });
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        executing: false,
      }));
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">NeuroHarmony DAO Governance</h2>
        <button
          onClick={handleRefreshProposals}
          className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
          Refresh Proposals
        </button>
      </div>

      {/* Voting Power Display - Only show if wallet is connected */}
      {account && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Your Voting Power</h2>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{votingPower} NEURO</span>
            <p className="text-sm text-gray-600">
              (Based on your staked tokens)
            </p>
          </div>
        </div>
      )}

      {/* Create New Proposal - Only show if wallet is connected */}
      {account && (
        <div className="mb-8 rounded-lg bg-white p-4 shadow">
          <h3 className="mb-4 text-xl font-semibold">Create New Proposal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Proposal Description
              </label>
              <textarea
                placeholder="Enter a detailed description of your proposal..."
                value={newProposal.description}
                onChange={(e) => {
                  setNewProposal({
                    ...newProposal,
                    description: e.target.value,
                  });
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
                Budget (in ETH)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter the budget in ETH"
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
              />
              {formErrors.budget && (
                <p className="mt-1 text-sm text-red-500">{formErrors.budget}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loadingStates.creatingProposal}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
              {loadingStates.creatingProposal
                ? "Creating Proposal..."
                : "Create Proposal"}
            </button>
          </form>
        </div>
      )}

      {/* Proposals List - Always show */}
      <div className="space-y-4">
        {loadingStates.fetchingProposals ? (
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
              {account
                ? "Create the first proposal to get started!"
                : "Connect your wallet to create the first proposal!"}
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
                      Total Votes:{" "}
                      {web3
                        ? web3.utils.fromWei(proposal.votes.toString(), "ether")
                        : "0"}{" "}
                      NEURO
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
                        onClick={() => handleVote(proposal.id)}
                        disabled={loadingStates.voting[proposal.id]}
                        className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400">
                        {loadingStates.voting[proposal.id]
                          ? "Voting..."
                          : "Vote with 0.1 NEURO"}
                      </button>
                      <button
                        onClick={async () => {
                          if (!account) {
                            showModal(
                              "Wallet Required",
                              "Please connect your wallet to execute proposals.",
                            );
                            return;
                          }
                          await handleExecuteProposal(proposal.id);
                        }}
                        disabled={loadingStates.executing}
                        className="w-full rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400">
                        {loadingStates.executing ? "Executing..." : "Execute"}
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
