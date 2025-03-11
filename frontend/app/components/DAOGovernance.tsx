"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { neuroGrantDAO, neuroToken } from "../lib/web3";
import Web3 from "web3";
import Modal from "./Modal";
import { AbiItem } from "web3-utils";

interface ContractProposal {
  description: string;
  budget: string;
  votes: string;
  proposer: string;
  executed: boolean;
  [key: number]: string | boolean;
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
  web3: Web3 | null;
  account: string | null;
  showModal: (title: string, message: string) => void;
}

interface LoadingStates {
  fetchingProposals: boolean;
  creatingProposal: boolean;
  voting: { [proposalId: number]: boolean };
  executing: boolean;
  updatingVotingPower: boolean;
  fetchingVotingPower: boolean;
}

const DAOGovernance: React.FC<DAOGovernanceProps> = ({
  web3,
  account,
  showModal,
}): ReactNode => {
  const [mounted, setMounted] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votingPower, setVotingPower] = useState<string>("0");
  const [newProposal, setNewProposal] = useState({
    description: "",
    budget: "",
  });
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    fetchingProposals: false,
    creatingProposal: false,
    voting: {},
    executing: false,
    updatingVotingPower: false,
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

  // Only check voting power when account changes
  useEffect(() => {
    if (mounted && web3 && account) {
      const neuroTokenContract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      neuroTokenContract.methods
        .getStakedAmount(account)
        .call()
        .then((stakedAmount: any) => {
          if (stakedAmount && BigInt(stakedAmount.toString()) > BigInt(0)) {
            setVotingPower(
              web3.utils.fromWei(stakedAmount.toString(), "ether"),
            );
          } else {
            setVotingPower("0");
          }
        })
        .catch((error: Error) => {
          console.error("Error checking staked amount:", error);
          setVotingPower("0");
        });
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
            const rawProposal = (await contract.methods
              .proposals(i)
              .call()) as ContractProposal;

            if (!rawProposal) continue;

            // Type assertions to handle potential boolean values
            const description = String(
              rawProposal.description || rawProposal[1] || "",
            );
            const budget = String(rawProposal.budget || rawProposal[2] || "0");
            const proposer = String(
              rawProposal.proposer || rawProposal[4] || "",
            );
            const executed = Boolean(rawProposal.executed || rawProposal[5]);
            const votes = String(rawProposal.votes || rawProposal[3] || "0");

            fetchedProposals.push({
              id: i,
              description,
              budget: web3.utils.fromWei(budget, "ether"),
              proposer,
              isExecuted: executed,
              votes: Number(votes),
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

  const syncVotingPower = async () => {
    if (!web3 || !account) {
      return;
    }

    try {
      console.log("=== Starting syncVotingPower ===");
      console.log("Account:", account);
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        updatingVotingPower: true,
      }));

      const neuroTokenContract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      const stakedAmount: any = await neuroTokenContract.methods
        .getStakedAmount(account)
        .call();
      console.log("Current staked amount (wei):", stakedAmount);
      const stakedAmountInNeuro = web3.utils.fromWei(
        stakedAmount.toString(),
        "ether",
      );
      console.log("Current staked amount (NEURO):", stakedAmountInNeuro);

      if (BigInt(stakedAmount.toString()) <= BigInt(0)) {
        console.log("No staked tokens found, setting voting power to 0");
        setVotingPower("0");
        return;
      }

      const daoContract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      try {
        const currentPower: any = await daoContract.methods
          .getVotingPower(account)
          .call();
        console.log(
          "Current voting power before update (NEURO):",
          web3.utils.fromWei(currentPower.toString(), "ether"),
        );

        console.log("Attempting to update voting power...");
        const gasEstimate = await daoContract.methods
          .updateVotingPower(account)
          .estimateGas({ from: account });

        const updateTx = await daoContract.methods
          .updateVotingPower(account)
          .send({
            from: account,
            gas: ((BigInt(gasEstimate) * BigInt(12)) / BigInt(10)).toString(),
          });
        console.log("Update voting power transaction:", updateTx);

        const newPower: any = await daoContract.methods
          .getVotingPower(account)
          .call();
        console.log(
          "New voting power (NEURO):",
          web3.utils.fromWei(newPower.toString(), "ether"),
        );
        setVotingPower(web3.utils.fromWei(newPower.toString(), "ether"));
      } catch (error) {
        console.warn(
          "Failed to update voting power, using staked amount instead",
        );
        console.error("Update voting power error:", error);
        setVotingPower(stakedAmountInNeuro);
      }
    } catch (error) {
      console.error("Error in syncVotingPower:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
      console.warn("Failed to sync voting power, will try again later");
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        updatingVotingPower: false,
      }));
    }
  };

  const voteForProposal = async (proposalId: number) => {
    if (!web3 || !account) {
      setModal({
        isOpen: true,
        title: "Error",
        message: "Please connect your wallet first",
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

      // First check if the proposal exists and is not executed
      const proposal = (await contract.methods
        .proposals(proposalId)
        .call()) as ContractProposal;

      if (!proposal) {
        setModal({
          isOpen: true,
          title: "Error",
          message: "Proposal not found.",
        });
        return;
      }

      if (proposal.executed) {
        setModal({
          isOpen: true,
          title: "Error",
          message: "This proposal has already been executed.",
        });
        return;
      }

      // Check if user has already voted
      const hasVoted = await contract.methods
        .hasUserVoted(proposalId, account)
        .call();

      if (hasVoted) {
        setModal({
          isOpen: true,
          title: "Voting Error",
          message: "You have already voted on this proposal.",
        });
        return;
      }

      // Check current voting power before attempting to update
      const currentVotingPower: string = await contract.methods
        .getVotingPower(account)
        .call();

      // Get current staked amount from NEUROToken contract
      const neuroTokenContract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      const stakedAmount: string = await neuroTokenContract.methods
        .getStakedAmount(account)
        .call();

      if (BigInt(stakedAmount) <= BigInt(0)) {
        setModal({
          isOpen: true,
          title: "Voting Error",
          message:
            "You need to stake NEURO tokens to vote. Please stake some tokens first.",
        });
        return;
      }

      // Use 0.1 NEURO for voting
      const voteAmount = web3.utils.toWei("0.1", "ether");

      // Check if user has enough voting power
      if (BigInt(currentVotingPower) < BigInt(voteAmount)) {
        // Try to update voting power first
        await contract.methods.updateVotingPower(account).send({
          from: account,
          gas: "200000",
        });

        // Check voting power again
        const newVotingPower: string = await contract.methods
          .getVotingPower(account)
          .call();

        if (BigInt(newVotingPower) < BigInt(voteAmount)) {
          setModal({
            isOpen: true,
            title: "Voting Error",
            message: `Insufficient voting power. You need at least 0.1 NEURO voting power. Current voting power: ${web3.utils.fromWei(
              newVotingPower,
              "ether",
            )} NEURO`,
          });
          return;
        }
      }

      // Try to vote with a higher gas limit
      const gasEstimate = await contract.methods
        .vote(proposalId, voteAmount)
        .estimateGas({ from: account });

      // Use 2x the estimated gas to ensure enough gas for both voting power update and vote
      const adjustedGas = (BigInt(gasEstimate) * BigInt(2)).toString();

      const voteTx = await contract.methods.vote(proposalId, voteAmount).send({
        from: account,
        gas: adjustedGas,
      });

      // Wait for one block confirmation
      await web3.eth.getTransactionReceipt(voteTx.transactionHash);

      // Update voting power after successful vote
      const updatedVotingPower: string = await contract.methods
        .getVotingPower(account)
        .call();
      setVotingPower(web3.utils.fromWei(updatedVotingPower, "ether"));

      // Refresh proposals to show updated vote count
      await fetchProposals();

      setModal({
        isOpen: true,
        title: "Success",
        message: "Successfully voted on the proposal!",
      });
    } catch (error) {
      console.error("Error voting for proposal:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      if (
        error instanceof Error &&
        error.message.includes("insufficient funds")
      ) {
        setModal({
          isOpen: true,
          title: "Voting Failed",
          message:
            "Insufficient funds for gas. Please make sure you have enough ETH to cover the transaction.",
        });
        return;
      }

      setModal({
        isOpen: true,
        title: "Voting Failed",
        message: `Failed to vote on proposal: ${errorMessage}. Please try again.`,
      });
    } finally {
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        voting: { ...prev.voting, [proposalId]: false },
      }));
    }
  };

  const executeProposal = async (proposalId: number) => {
    if (!web3 || !account) {
      showModal("Error", "Please connect your wallet first");
      return;
    }

    try {
      setLoadingStates((prev: LoadingStates) => ({ ...prev, executing: true }));
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
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
      setLoadingStates((prev: LoadingStates) => ({
        ...prev,
        executing: false,
      }));
    }
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const requireWalletConnection =
    (action: () => Promise<void>, actionName: string) => async () => {
      if (!account) {
        showModal(
          "Wallet Required",
          `Please connect your wallet to ${actionName}.`,
        );
        return;
      }
      await action();
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
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Your Voting Power
            </h3>
            <p className="mt-2 text-2xl font-bold text-purple-600">
              {votingPower} NEURO
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Stake NEURO tokens to increase your voting power
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
                      Votes:{" "}
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
                        onClick={async () => {
                          if (!account) {
                            showModal(
                              "Wallet Required",
                              "Please connect your wallet to vote on proposals.",
                            );
                            return;
                          }
                          await voteForProposal(proposal.id);
                        }}
                        disabled={loadingStates.voting[proposal.id]}
                        className="w-full rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400">
                        {loadingStates.voting[proposal.id]
                          ? "Voting..."
                          : "Vote"}
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
                          await executeProposal(proposal.id);
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
