"use client";

import React, { useState, useEffect } from "react";
import { neuroToken } from "../lib/web3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import Modal from "./Modal";

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
      const contract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      const balanceWei: string = await contract.methods
        .balanceOf(account)
        .call();
      const balance = web3.utils.fromWei(balanceWei, "ether");
      setBalance(balance);

      const stakedWei: string = await contract.methods
        .getStakedAmount(account)
        .call();
      const staked = web3.utils.fromWei(stakedWei, "ether");
      setStakedAmount(staked);
    } catch (error) {
      console.error("Error fetching balances:", error);
      showModal("Error", "Failed to fetch token balances.");
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
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      const amountWei = web3.utils.toWei(stakeInput, "ether");
      await contract.methods.stake(amountWei).send({ from: account });

      await fetchBalances();
      setStakeInput("");
      showModal("Success", `Successfully staked ${stakeInput} NEURO tokens!`);
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
      const contract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      await contract.methods.unstake().send({ from: account });

      await fetchBalances();
      showModal("Success", "Successfully unstaked your NEURO tokens!");
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
