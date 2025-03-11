"use client";

import React, { useState, useEffect } from "react";
import { neuroToken } from "../lib/web3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import Modal from "./Modal";

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
  type: "dataset_upload" | "proposal_creation" | "vote" | "stake";
  amount: string;
  timestamp: number;
}

interface ContractEvent {
  returnValues: {
    rewardType: RewardActivity["type"];
    amount: string;
    timestamp: string;
  };
}

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
      const contract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      const events = (await contract.getPastEvents("allEvents", {
        filter: { recipient: account },
        fromBlock: 0,
        toBlock: "latest",
      })) as unknown as ContractEvent[];

      const history: RewardActivity[] = events
        .filter(
          (event) =>
            event.returnValues &&
            event.returnValues.rewardType &&
            event.returnValues.amount &&
            event.returnValues.timestamp,
        )
        .map((event, index) => ({
          id: index + 1,
          type: event.returnValues.rewardType,
          amount: web3.utils.fromWei(event.returnValues.amount, "ether"),
          timestamp: parseInt(event.returnValues.timestamp),
        }));

      setRewardHistory(history);
    } catch (error) {
      console.error("Error fetching reward history:", error);
      showModal("Error", "Failed to fetch reward history.");
    }
  };

  const stakeTokens = async () => {
    try {
      // First validate if the amount to stake is more than available balance
      const stakeAmountWei = web3.utils.toWei(stakeInput, "ether");
      const currentBalanceWei = web3.utils.toWei(balance, "ether");

      if (BigInt(stakeAmountWei) > BigInt(currentBalanceWei)) {
        showModal(
          "Insufficient Balance",
          `You cannot stake more tokens than your available balance.\n\nAvailable Balance: ${balance} NEURO\nTrying to Stake: ${stakeInput} NEURO`,
        );
        return;
      }

      setLoading(true);
      const response = await fetch("http://localhost:5000/api/python/stake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account,
          amount: stakeAmountWei,
          private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY,
        }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBalances();
        setStakeInput("");
        showModal("Success", `Successfully staked ${stakeInput} NEURO tokens!`);
      } else {
        if (result.errorType === "INSUFFICIENT_BALANCE") {
          const currentBalance = web3.utils.fromWei(
            result.error.match(/Current balance: (\d+)/)[1],
            "ether",
          );
          const tryingToStake = web3.utils.fromWei(
            result.error.match(/Trying to stake: (\d+)/)[1],
            "ether",
          );
          showModal(
            "Insufficient Balance",
            `You don't have enough NEURO tokens to stake.\n\nCurrent Balance: ${currentBalance} NEURO\nTrying to Stake: ${tryingToStake} NEURO\n\nPlease reduce the amount or get more tokens.`,
          );
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error("Error staking tokens:", error);
      showModal("Error", "Failed to stake tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const unstakeTokens = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/python/unstake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: account,
          amount: stakedAmount,
          private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY,
        }),
      });

      const result = await response.json();
      if (result.success) {
        await fetchBalances();
        showModal("Success", "Successfully unstaked your NEURO tokens!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      showModal("Error", "Failed to unstake tokens. Please try again.");
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="p-6">
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
      <div className="rounded-lg bg-white p-4 shadow">
        <h3 className="mb-4 text-xl font-semibold">Reward History</h3>
        <div className="space-y-2">
          {rewardHistory.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded bg-gray-50 p-3">
              <div>
                <p className="font-medium">
                  {activity.type
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
              <p className="font-semibold text-green-600">
                +{activity.amount} NEURO
              </p>
            </div>
          ))}
          {rewardHistory.length === 0 && (
            <p className="text-center text-gray-500">No reward history yet</p>
          )}
        </div>
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
