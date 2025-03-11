"use client";

import React, { useState, useEffect } from "react";
import { neuroToken } from "../lib/web3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import Modal from "./Modal";
import { EventLog } from "web3-types";

// Add ERC20 ABI for basic token functions
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "stakedTokens",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "unstake",
    outputs: [],
    type: "function",
  },
];

interface TokenRewardsProps {
  web3: Web3;
  account: string;
}

interface RewardActivity {
  id: number;
  type: "staked" | "unstaked" | "rewarded";
  amount: string;
  timestamp: number;
}

interface EventReturnValues extends Record<string, unknown> {
  amount: string;
  user?: string;
}

interface NEUROEventLog extends EventLog {
  event: string;
  returnValues: EventReturnValues;
}

// Update the isEventLog type guard to be more specific
function isNEUROEventLog(event: unknown): event is NEUROEventLog {
  if (!event || typeof event !== "object") return false;

  const candidate = event as Record<string, unknown>;
  const returnValues = candidate.returnValues as EventReturnValues | undefined;

  return (
    typeof candidate.event === "string" &&
    typeof candidate.blockNumber === "number" &&
    typeof candidate.address === "string" &&
    Array.isArray(candidate.topics) &&
    typeof candidate.data === "string" &&
    returnValues !== null &&
    typeof returnValues === "object" &&
    typeof returnValues.amount === "string" &&
    ["Staked", "Unstaked", "Rewarded"].includes(candidate.event)
  );
}

// Update the event processing function
const processEvent = (event: NEUROEventLog): RewardActivity => {
  const eventType = event.event.toLowerCase() as RewardActivity["type"];
  return {
    id: Number(event.blockNumber),
    type: eventType,
    amount: event.returnValues.amount,
    timestamp: Date.now(), // You might want to get this from the block timestamp
  };
};

const TokenRewards: React.FC<TokenRewardsProps> = ({ web3, account }) => {
  const [balance, setBalance] = useState<string>("0");
  const [stakedAmount, setStakedAmount] = useState<string>("0");
  const [stakeInput, setStakeInput] = useState<string>("");
  const [rewardHistory, setRewardHistory] = useState<RewardActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const EVENTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalEvents, setTotalEvents] = useState<number>(0);

  useEffect(() => {
    fetchBalances();
    fetchRewardHistory();
  }, [account]);

  const fetchBalances = async () => {
    try {
      console.log("Starting fetchBalances...");

      // First check if web3 is properly initialized
      if (!web3 || !web3.eth) {
        console.error("Web3 is not properly initialized");
        showModal(
          "Connection Error",
          "Web3 is not properly initialized. Please ensure MetaMask is installed and working.",
        );
        return;
      }
      console.log("Web3 initialized successfully");

      // Check if MetaMask is connected
      const accounts = await web3.eth.getAccounts();
      console.log("Connected accounts:", accounts);

      if (!accounts || accounts.length === 0) {
        console.error("No accounts found - please connect MetaMask");
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
        showModal(
          "Network Error",
          "Unable to detect network. Please check your MetaMask connection.",
        );
        return;
      }

      // Check if we're on the correct network
      if (Number(networkId) !== 31337) {
        console.error("Please connect to the local hardhat network");
        showModal(
          "Network Error",
          "Please connect to the local hardhat network to interact with the DAO.",
        );
        return;
      }
      console.log("Network check passed");

      // Verify contract address
      console.log("NEUROToken contract address:", neuroToken.address);
      if (!neuroToken.address) {
        console.error("Contract address is not defined");
        showModal(
          "Contract Error",
          "Contract address is not defined. Please check your configuration.",
        );
        return;
      }

      // Create contract instance with combined ABI
      console.log("Creating contract instance...");
      const combinedABI = [...ERC20_ABI, ...neuroToken.abi];
      console.log(
        "Combined Contract ABI:",
        JSON.stringify(combinedABI, null, 2),
      );

      const contract = new web3.eth.Contract(
        combinedABI as AbiItem[],
        neuroToken.address,
      );
      console.log("Contract instance created:", contract);

      // Verify contract is deployed
      const code = await web3.eth.getCode(neuroToken.address);
      console.log("Contract code at address:", code);

      if (code === "0x") {
        console.error("No contract code at specified address");
        showModal(
          "Contract Error",
          "No contract found at the specified address. Please ensure the contract is deployed.",
        );
        return;
      }

      // Fetch balances
      console.log("Fetching balance for account:", account);
      const balanceWei: string = await contract.methods
        .balanceOf(account)
        .call();
      console.log("Balance in Wei:", balanceWei);
      const balance = web3.utils.fromWei(balanceWei, "ether");
      console.log("Balance in Ether:", balance);
      setBalance(balance);

      // Log available methods
      console.log("Available contract methods:", Object.keys(contract.methods));

      console.log("Fetching staked amount for account:", account);
      const stakedWei: string = await contract.methods
        .stakedTokens(account)
        .call();
      console.log("Staked amount in Wei:", stakedWei);
      const staked = web3.utils.fromWei(stakedWei, "ether");
      console.log("Staked amount in Ether:", staked);
      setStakedAmount(staked);
    } catch (error: Error | unknown) {
      console.error("Error fetching balances:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      showModal("Error", "Failed to fetch token balances. Please try again.");
    }
  };

  const fetchRewardHistory = async () => {
    try {
      console.log("=== Fetching reward history ===");

      const contract = new web3.eth.Contract(
        [...ERC20_ABI, ...neuroToken.abi] as AbiItem[],
        neuroToken.address,
      );

      // Calculate block range for pagination
      const latestBlock = await web3.eth.getBlockNumber();
      const fromBlock = Math.max(
        0,
        Number(latestBlock) - currentPage * EVENTS_PER_PAGE,
      );
      const toBlock = Number(latestBlock) - (currentPage - 1) * EVENTS_PER_PAGE;

      console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);

      // Get all events
      const events = await contract.getPastEvents("allEvents", {
        fromBlock,
        toBlock,
      });

      // Process events
      const activities = events
        .filter((event): event is NEUROEventLog => isNEUROEventLog(event))
        .map(processEvent)
        .sort((a, b) => b.timestamp - a.timestamp);

      setRewardHistory(activities);
      setTotalEvents(events.length);
    } catch (error) {
      console.error("Error fetching reward history:", error);
      showModal("Error", "Failed to fetch reward history. Please try again.");
    }
  };

  const stakeTokens = async () => {
    try {
      console.log("=== Starting stakeTokens function ===");
      console.log("Account:", account);
      console.log("Stake Input:", stakeInput);

      // Input validation
      if (!stakeInput || isNaN(Number(stakeInput)) || Number(stakeInput) <= 0) {
        showModal(
          "Validation Error",
          "Please enter a valid positive number of tokens to stake.",
        );
        return;
      }

      // Convert input to Wei for comparison
      const stakeAmountWei = web3.utils.toWei(stakeInput, "ether");
      const balanceWei = web3.utils.toWei(balance, "ether");

      // Check if stake amount is more than available balance
      if (BigInt(stakeAmountWei) > BigInt(balanceWei)) {
        showModal(
          "Insufficient Balance",
          `You cannot stake more than your available balance of ${balance} NEURO tokens.`,
        );
        return;
      }

      setLoading(true);

      // Create contract instance
      const contract = new web3.eth.Contract(
        [...ERC20_ABI, ...neuroToken.abi] as AbiItem[],
        neuroToken.address,
      );

      // Estimate gas first
      const gasEstimate = await contract.methods
        .stake(stakeAmountWei)
        .estimateGas({ from: account });

      // Send transaction with estimated gas (add 20% buffer)
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

      const transaction = await contract.methods.stake(stakeAmountWei).send({
        from: account,
        gas: gasLimit,
      });

      console.log("Stake transaction successful:", transaction);
      showModal("Success", `Successfully staked ${stakeInput} NEURO tokens.`);

      // Clear input and refresh balances
      setStakeInput("");
      await fetchBalances();
      await fetchRewardHistory();
    } catch (error: unknown) {
      console.error("Error in stakeTokens:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showModal(
        "Transaction Failed",
        `Failed to stake tokens: ${errorMessage}. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const unstakeTokens = async () => {
    try {
      console.log("=== Starting unstakeTokens function ===");
      console.log("Account:", account);
      console.log("Unstake Input:", stakeInput);

      // Input validation
      if (!stakeInput || isNaN(Number(stakeInput)) || Number(stakeInput) <= 0) {
        showModal(
          "Validation Error",
          "Please enter a valid positive number of tokens to unstake.",
        );
        return;
      }

      // Convert input to Wei for comparison
      const unstakeAmountWei = web3.utils.toWei(stakeInput, "ether");
      const stakedWei = web3.utils.toWei(stakedAmount, "ether");

      // Check if unstake amount is more than staked balance
      if (BigInt(unstakeAmountWei) > BigInt(stakedWei)) {
        showModal(
          "Insufficient Staked Balance",
          `You cannot unstake more than your staked balance of ${stakedAmount} NEURO tokens.`,
        );
        return;
      }

      setLoading(true);

      // Create contract instance
      const contract = new web3.eth.Contract(
        [...ERC20_ABI, ...neuroToken.abi] as AbiItem[],
        neuroToken.address,
      );

      // Estimate gas first
      const gasEstimate = await contract.methods
        .unstake(unstakeAmountWei)
        .estimateGas({ from: account });

      // Send transaction with estimated gas (add 20% buffer)
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2).toString();

      const transaction = await contract.methods
        .unstake(unstakeAmountWei)
        .send({
          from: account,
          gas: gasLimit,
        });

      console.log("Unstake transaction successful:", transaction);
      showModal("Success", `Successfully unstaked ${stakeInput} NEURO tokens.`);

      // Clear input and refresh balances
      setStakeInput("");
      await fetchBalances();
      await fetchRewardHistory();
    } catch (error: unknown) {
      console.error("Error in unstakeTokens:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      showModal(
        "Transaction Failed",
        `Failed to unstake tokens: ${errorMessage}. Please try again.`,
      );
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

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">NEURO Token & Rewards</h2>

      {/* Token Balances */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Available Balance</h3>
          <p className="text-2xl font-bold text-blue-600">{balance} NEURO</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Staked Amount</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stakedAmount} NEURO
          </p>
        </div>
      </div>

      {/* Staking Interface */}
      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-xl font-semibold">Stake Your Tokens</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Amount to stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              className="flex-1 rounded border p-2"
              step="0.1"
            />
            <button
              onClick={stakeTokens}
              disabled={loading || !stakeInput}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:bg-gray-400">
              {loading ? "Staking..." : "Stake"}
            </button>
          </div>
          {Number(stakedAmount) > 0 && (
            <button
              onClick={unstakeTokens}
              disabled={loading}
              className="w-full rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400">
              {loading ? "Unstaking..." : "Unstake All"}
            </button>
          )}
        </div>
      </div>

      {/* Reward History */}
      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold">Reward History</h3>
        <div className="space-y-4">
          {rewardHistory.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div>
                <p className="font-medium">
                  {activity.type === "rewarded"
                    ? "Reward Received"
                    : activity.type === "staked"
                    ? "Tokens Staked"
                    : "Tokens Unstaked"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(activity.timestamp * 1000).toLocaleString()}
                </p>
              </div>
              <p
                className={`font-medium ${
                  activity.type === "unstaked"
                    ? "text-red-600"
                    : activity.type === "staked"
                    ? "text-purple-600"
                    : "text-green-600"
                }`}>
                {activity.type === "unstaked" ? "-" : "+"}
                {activity.amount} NEURO
              </p>
            </div>
          ))}
          {rewardHistory.length === 0 && (
            <p className="text-center text-gray-500">No reward history yet</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalEvents > EVENTS_PER_PAGE && (
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {Math.ceil(totalEvents / EVENTS_PER_PAGE)}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalEvents / EVENTS_PER_PAGE)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
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

export default TokenRewards;
