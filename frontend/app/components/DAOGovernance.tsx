"use client";

import React, { useState, useEffect } from "react";
import { neuroGrantDAO } from "../lib/web3";
import Web3 from "web3";
import Modal from "./Modal";
import { AbiItem } from "web3-utils";

interface ContractProposal {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: boolean;
  id: string;
  description: string;
  budget: string;
  votes: string;
  proposer: string;
  executed: boolean;
}

interface Proposal {
  id: number;
  description: string;
  budget: string;
  proposer: string;
  isExecuted: boolean;
  votes: number;
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
  const [loadingStates, setLoadingStates] = useState({
    fetchingProposals: false,
    creatingProposal: false,
    voting: false,
    executing: false,
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
    return () => {
      setLoadingStates({
        fetchingProposals: false,
        creatingProposal: false,
        voting: false,
        executing: false,
      });
    };
  }, []);

  useEffect(() => {
    if (mounted && web3 && account) {
      console.log("Attempting to fetch proposals with:", {
        web3: !!web3,
        account,
        contractAddress: neuroGrantDAO.address,
      });
      checkNetworkAndFetch();
    }
  }, [mounted, web3, account]);

  const checkNetworkAndFetch = async () => {
    try {
      // First check if web3 is properly initialized
      if (!web3 || !web3.eth) {
        console.error("Web3 is not properly initialized");
        setProposals([]);
        showModal(
          "Connection Error",
          "Web3 is not properly initialized. Please ensure MetaMask is installed and working.",
        );
        return;
      }

      // Check if MetaMask is connected
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        console.error("No accounts found - please connect MetaMask");
        setProposals([]);
        showModal(
          "Connection Error",
          "No accounts found. Please connect your MetaMask wallet.",
        );
        return;
      }

      // Try to get network ID with error handling
      let networkId;
      try {
        networkId = await web3.eth.net.getId();
        console.log("Current network ID:", networkId);
      } catch (networkError) {
        console.error("Error getting network ID:", networkError);
        setProposals([]);
        showModal(
          "Network Error",
          "Unable to detect network. Please check your MetaMask connection.",
        );
        return;
      }

      // Check if we're on the correct network (e.g., localhost:8545 is network 31337)
      if (Number(networkId) !== 31337) {
        console.error("Please connect to the local hardhat network");
        setProposals([]);
        showModal(
          "Network Error",
          "Please connect to the local hardhat network to interact with the DAO.",
        );
        return;
      }

      // Verify RPC connection
      try {
        await web3.eth.getBlockNumber();
      } catch (rpcError) {
        console.error("RPC connection failed:", rpcError);
        setProposals([]);
        showModal(
          "Connection Error",
          "Failed to connect to the network. Please check your RPC connection.",
        );
        return;
      }

      fetchProposals();
    } catch (error) {
      console.error("Error checking network:", error);
      setProposals([]);
      showModal(
        "Network Error",
        "Failed to check network. Please ensure MetaMask is connected.",
      );
    }
  };

  const fetchProposals = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, fetchingProposals: true }));

      // Verify contract address
      if (!neuroGrantDAO.address) {
        console.error("Contract address is not defined");
        setProposals([]);
        setLoadingStates((prev) => ({ ...prev, fetchingProposals: false }));
        showModal(
          "Contract Error",
          "Contract address is not defined. Please check your configuration.",
        );
        return;
      }

      console.log(
        "Attempting to connect to contract at:",
        neuroGrantDAO.address,
      );

      // Create contract instance
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      // Verify contract is deployed
      try {
        const code = await web3.eth.getCode(neuroGrantDAO.address);
        console.log("Contract code at address:", code);

        if (code === "0x") {
          console.error("No contract code at specified address");
          setProposals([]);
          setLoadingStates((prev) => ({ ...prev, fetchingProposals: false }));
          showModal(
            "Contract Error",
            "No contract found at the specified address. Please ensure the contract is deployed.",
          );
          return;
        }

        // Try to call proposalCount() directly without estimateGas
        const proposalCount = await contract.methods.proposalCount().call();
        console.log("Proposal count:", proposalCount);
        const count = Number(proposalCount);

        const fetchedProposals: Proposal[] = [];
        if (count > 0) {
          for (let i = 1; i <= count; i++) {
            try {
              const rawProposal = (await contract.methods
                .proposals(i)
                .call()) as ContractProposal;
              console.log(`Raw proposal ${i} data:`, rawProposal);

              // Add additional error checking
              if (!rawProposal) {
                console.error(`Proposal ${i} returned null or undefined`);
                continue;
              }

              // Web3.js returns struct data as both array and named properties
              const proposalData = {
                id: rawProposal.id || rawProposal[0],
                description: rawProposal.description || rawProposal[1],
                budget: rawProposal.budget || rawProposal[2],
                votes: rawProposal.votes || rawProposal[3],
                proposer: rawProposal.proposer || rawProposal[4],
                executed: rawProposal.executed || rawProposal[5],
              };

              console.log(`Decoded proposal ${i} data:`, proposalData);

              if (!proposalData.description) {
                console.error(
                  `Invalid proposal data for id ${i}:`,
                  proposalData,
                );
                continue;
              }

              fetchedProposals.push({
                id: i,
                description: proposalData.description,
                budget: web3.utils.fromWei(proposalData.budget, "ether"),
                proposer: proposalData.proposer,
                isExecuted: proposalData.executed,
                votes: Number(proposalData.votes),
              });
            } catch (error) {
              console.error(`Error fetching proposal ${i}:`, error);
            }
          }
        }
        console.log("Fetched proposals:", fetchedProposals);
        setProposals(fetchedProposals);
      } catch (error) {
        console.error("Error interacting with contract:", error);
        setProposals([]);
        showModal(
          "Contract Error",
          "Failed to interact with the contract. Please ensure it is properly deployed.",
        );
      }
    } catch (error) {
      console.error("Error in fetchProposals:", error);
      setProposals([]);
      showModal(
        "Error",
        "Failed to fetch proposals. Please check your network connection and try again.",
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, fetchingProposals: false }));
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
    if (!validateForm()) {
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, creatingProposal: true }));
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
      setLoadingStates((prev) => ({ ...prev, creatingProposal: false }));
    }
  };

  const voteForProposal = async (proposalId: number) => {
    try {
      setLoadingStates((prev) => ({ ...prev, voting: true }));
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      // Get the user's voting power from the mapping
      const userVotingPower = await contract.methods
        .votingPower(account)
        .call();
      console.log("User voting power:", userVotingPower);

      if (Number(userVotingPower) <= 0) {
        showModal(
          "Error",
          "You don't have any voting power. You need to stake NEURO tokens to get voting power.",
        );
        return;
      }

      // Use 1 vote by default, or the user's available voting power if less than 1
      const votesToUse = Math.min(1, Number(userVotingPower));
      console.log("Attempting to use votes:", votesToUse);

      await contract.methods
        .vote(proposalId, votesToUse)
        .send({ from: account });
      await fetchProposals();
      showModal(
        "Success",
        `Successfully voted on proposal #${proposalId} with ${votesToUse} vote(s)!`,
      );
    } catch (error: unknown) {
      console.error("Error voting for proposal:", error);
      if (
        error instanceof Error &&
        error.message.includes("Insufficient voting power")
      ) {
        showModal(
          "Error",
          "You don't have enough voting power. Please stake more NEURO tokens.",
        );
      } else {
        showModal("Error", "Failed to cast vote. Please try again.");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, voting: false }));
    }
  };

  const executeProposal = async (proposalId: number) => {
    try {
      setLoadingStates((prev) => ({ ...prev, executing: true }));
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
      setLoadingStates((prev) => ({ ...prev, executing: false }));
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
        <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Proposals List */}
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
                        disabled={loadingStates.voting}
                        className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400">
                        {loadingStates.voting ? "Voting..." : "Vote"}
                      </button>
                      <button
                        onClick={() => executeProposal(proposal.id)}
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
