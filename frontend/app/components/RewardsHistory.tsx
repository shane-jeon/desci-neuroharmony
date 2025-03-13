import React, { useState, useEffect } from "react";
import { neuroToken } from "../lib/web3";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

interface RewardsHistoryProps {
  web3: Web3 | null;
  account: string | null;
}

interface RewardEvent {
  amount: string;
  timestamp: string;
  type: string;
}

const RewardsHistory: React.FC<RewardsHistoryProps> = ({ web3, account }) => {
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRewardHistory = async () => {
    if (!web3 || !account) return;

    try {
      setLoading(true);
      const contract = new web3.eth.Contract(
        neuroToken.abi as AbiItem[],
        neuroToken.address,
      );

      // Get past events for rewards
      const fromBlock = (await web3.eth.getBlockNumber()) - 10000; // Last 10000 blocks
      const events = await contract.getPastEvents("RewardClaimed", {
        filter: { user: account },
        fromBlock,
        toBlock: "latest",
      });

      // Format events
      const formattedEvents = await Promise.all(
        events.map(async (event) => {
          const block = await web3.eth.getBlock(event.blockNumber);
          return {
            amount: web3.utils.fromWei(event.returnValues.amount, "ether"),
            timestamp: new Date(
              Number(block.timestamp) * 1000,
            ).toLocaleString(),
            type: "Reward Claimed",
          };
        }),
      );

      setRewardEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching reward history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (web3 && account) {
      fetchRewardHistory();
    }
  }, [web3, account]);

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">Rewards History</h2>

      {loading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
        </div>
      ) : rewardEvents.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No rewards history found
        </div>
      ) : (
        <div className="space-y-4">
          {rewardEvents.map((event, index) => (
            <div key={index} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-purple-600">{event.type}</p>
                  <p className="text-sm text-gray-500">{event.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{event.amount} NEURO</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchRewardHistory}
        className="mt-4 w-full rounded bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        disabled={loading || !account}>
        {loading ? "Refreshing..." : "Refresh History"}
      </button>
    </div>
  );
};

export default RewardsHistory;
