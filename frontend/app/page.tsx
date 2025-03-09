"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { MetaMaskInpageProvider } from "@metamask/providers";
import NeuroharmonyFrontend from "./components/NeuroharmonyFrontend";
import ResearchCollaboration from "./components/ResearchCollaboration";
import DAOGovernance from "./components/DAOGovernance";
import TokenRewards from "./components/TokenRewards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// Define a custom provider type that includes only the methods we need
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (params: unknown) => void) => void;
  removeListener: (event: string, callback: (params: unknown) => void) => void;
  isMetaMask?: boolean;
  isConnected?: () => boolean;
  networkVersion?: string;
  send?: unknown;
  sendAsync?: unknown;
  connected?: boolean;
}

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    web3: Web3;
  }
}

export default function Home() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const provider = window.ethereum as unknown as EthereumProvider;
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        try {
          // Request account access
          await provider.request({ method: "eth_requestAccounts" });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Listen for account changes
          provider.on("accountsChanged", (accounts: unknown) => {
            if (Array.isArray(accounts) && accounts[0]) {
              setAccount(accounts[0]);
            }
          });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to connect to wallet";
          setError(message);
          console.error("User denied account access:", message);
        }
      } else {
        const message = "Please install MetaMask!";
        setError(message);
        console.log(message);
      }
    };

    initWeb3();

    // Cleanup function
    return () => {
      if (window.ethereum) {
        const provider = window.ethereum as unknown as EthereumProvider;
        provider.removeListener("accountsChanged", (accounts: unknown) => {
          if (Array.isArray(accounts) && accounts[0]) {
            setAccount(accounts[0]);
          }
        });
      }
    };
  }, []);

  if (!web3 || !account) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="mb-8 text-4xl font-bold">NeuroHarmony Platform</h1>
        <div className="text-center">
          <p className="mb-4 text-xl">Please connect your wallet to continue</p>
          <p className="text-gray-600">
            {error || "Make sure MetaMask is installed and unlocked"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-8 text-4xl font-bold">NeuroHarmony Platform</h1>

      <Tabs defaultValue="datasets" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="collaboration">
            Research Collaboration
          </TabsTrigger>
          <TabsTrigger value="governance">DAO Governance</TabsTrigger>
          <TabsTrigger value="rewards">Token & Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="datasets">
          <NeuroharmonyFrontend />
        </TabsContent>

        <TabsContent value="collaboration">
          <ResearchCollaboration web3={web3} account={account} />
        </TabsContent>

        <TabsContent value="governance">
          <DAOGovernance web3={web3} account={account} />
        </TabsContent>

        <TabsContent value="rewards">
          <TokenRewards web3={web3} account={account} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
