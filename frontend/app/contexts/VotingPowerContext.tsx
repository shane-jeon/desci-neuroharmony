"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Web3 from "web3";
import { neuroGrantDAO } from "../lib/web3";
import { AbiItem } from "web3-utils";

interface VotingPowerContextType {
  votingPower: string;
  updateVotingPower: (web3: Web3, account: string) => Promise<void>;
}

const VotingPowerContext = createContext<VotingPowerContextType | undefined>(
  undefined,
);

export function VotingPowerProvider({ children }: { children: ReactNode }) {
  const [votingPower, setVotingPower] = useState<string>("0");

  const updateVotingPower = async (web3: Web3, account: string) => {
    try {
      const contract = new web3.eth.Contract(
        neuroGrantDAO.abi as AbiItem[],
        neuroGrantDAO.address,
      );

      const votingPower = (await contract.methods
        .getVotingPower(account)
        .call()) as string;

      if (votingPower && BigInt(votingPower) > BigInt(0)) {
        setVotingPower(web3.utils.fromWei(votingPower, "ether"));
      } else {
        setVotingPower("0");
      }
    } catch (error) {
      console.error("Error checking voting power:", error);
      setVotingPower("0");
    }
  };

  return (
    <VotingPowerContext.Provider value={{ votingPower, updateVotingPower }}>
      {children}
    </VotingPowerContext.Provider>
  );
}

export function useVotingPower() {
  const context = useContext(VotingPowerContext);
  if (context === undefined) {
    throw new Error("useVotingPower must be used within a VotingPowerProvider");
  }
  return context;
}
