import React from "react";
import Web3 from "web3";
import RewardsHistory from "./RewardsHistory";

interface TokensAndRewardsProps {
  web3: Web3 | null;
  account: string | null;
}

const TokensAndRewards: React.FC<TokensAndRewardsProps> = ({
  web3,
  account,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Tokens & Rewards</h1>

      {/* Token Information Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Your Tokens</h2>
          {/* Add token balance display here */}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Staking Information</h2>
          {/* Add staking information here */}
        </div>
      </div>

      {/* Rewards History Section */}
      <div className="mb-8">
        <RewardsHistory web3={web3} account={account} />
      </div>
    </div>
  );
};

export default TokensAndRewards;
