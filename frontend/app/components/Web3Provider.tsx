"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Web3Provider as EthersWeb3Provider } from "@ethersproject/providers";
import { useRouter } from "next/router";

interface Web3ContextType {
  provider: EthersWeb3Provider | null;
  account: string | null;
  chainId: number | null;
  isLoading: boolean;
  error: Error | null;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  account: null,
  chainId: null,
  isLoading: true,
  error: null,
});

export function useWeb3() {
  return useContext(Web3Context);
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<EthersWeb3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initWeb3 = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === "undefined") {
          throw new Error("Please install MetaMask to use this application");
        }

        // Create Web3 provider
        const web3Provider = new EthersWeb3Provider(window.ethereum);
        setProvider(web3Provider);

        // Get initial account and chain
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const network = await web3Provider.getNetwork();

        setAccount(accounts[0]);
        setChainId(network.chainId);

        // Listen for account changes
        window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
          setAccount(newAccounts[0] || null);
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", (newChainId: string) => {
          setChainId(parseInt(newChainId));
          router.reload();
        });

        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to initialize Web3"),
        );
        setIsLoading(false);
      }
    };

    initWeb3();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, [mounted, router]);

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return null;

  return (
    <Web3Context.Provider
      value={{ provider, account, chainId, isLoading, error }}>
      {children}
    </Web3Context.Provider>
  );
}
