import Web3 from "web3";
import { AbiItem } from "web3-utils";

// Define MetaMask error interface
interface MetaMaskError extends Error {
  code: number;
  message: string;
}

// Import the contract configuration from the backend config file.
// Adjust the relative path if necessary.
import contractsConfig from "../../../backend/config/contracts.config.json";

// Extract the NeuroDataProvenance contract info and cast the ABI appropriately.
export const neuroDataProvenance = {
  address: contractsConfig.NeuroDataProvenance.address,
  abi: contractsConfig.NeuroDataProvenance.abi[0].abi as unknown as AbiItem[],
};

// Extract the NeuroGrantDAO contract info and cast the ABI appropriately.
export const neuroGrantDAO = {
  address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  abi: [
    {
      inputs: [],
      name: "proposalCount",
      outputs: [{ type: "uint256", name: "" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ type: "uint256", name: "" }],
      name: "proposals",
      outputs: [
        { type: "string", name: "description" },
        { type: "uint256", name: "budget" },
        { type: "address", name: "proposer" },
        { type: "bool", name: "isExecuted" },
        { type: "uint256", name: "votes" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { type: "string", name: "_description" },
        { type: "uint256", name: "_budget" },
      ],
      name: "createProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ type: "uint256", name: "_proposalId" }],
      name: "voteForProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ type: "uint256", name: "_proposalId" }],
      name: "executeProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

// Extract the ResearchFunding contract info and cast the ABI appropriately.
export const researchFunding = {
  address: contractsConfig.ResearchFunding.address,
  abi: contractsConfig.ResearchFunding.abi[0].abi as unknown as AbiItem[],
};

// Extract the ScienceToken contract info and cast the ABI appropriately.
export const scienceToken = {
  address: contractsConfig.ScienceToken.address,
  abi: contractsConfig.ScienceToken.abi[0].abi as unknown as AbiItem[],
};

// Extract the NEUROToken contract info and cast the ABI appropriately.
export const neuroToken = {
  address: contractsConfig.NEUROToken.address,
  abi: [
    {
      inputs: [{ type: "address", name: "account" }],
      name: "balanceOf",
      outputs: [{ type: "uint256", name: "" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ type: "uint256", name: "amount" }],
      name: "stake",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unstake",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ type: "address", name: "account" }],
      name: "getStakedAmount",
      outputs: [{ type: "uint256", name: "" }],
      stateMutability: "view",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, type: "address", name: "recipient" },
        { indexed: false, type: "string", name: "rewardType" },
        { indexed: false, type: "uint256", name: "amount" },
        { indexed: false, type: "uint256", name: "timestamp" },
      ],
      name: "RewardDistributed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, type: "address", name: "user" },
        { indexed: false, type: "uint256", name: "amount" },
      ],
      name: "Staked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, type: "address", name: "user" },
        { indexed: false, type: "uint256", name: "amount" },
      ],
      name: "Unstaked",
      type: "event",
    },
  ],
};

// Extract the ResearchCollaboration contract info and cast the ABI appropriately.
export const researchCollaboration = {
  address: contractsConfig.ResearchCollaboration.address,
  abi: contractsConfig.ResearchCollaboration.abi[0].abi as unknown as AbiItem[],
};

// Set the backend URL from the environment variable or default to localhost.
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8545";

// Define Dataset interface
export interface Dataset {
  id: string;
  name: string;
  source: string;
  description: string;
  dataType: "ECG" | "EEG" | "EOG";
  metadata: {
    samplingRate?: number;
    channels?: number;
    duration?: number;
    subject?: {
      anonymizedId: string;
      age?: number;
      gender?: string;
    };
    permissions: {
      isPublic: boolean;
      authorizedResearchers: string[];
      sharingPreferences: {
        allowAnalysis: boolean;
        allowSharing: boolean;
        requiresConsent: boolean;
      };
    };
  };
  owner: string;
  timestamp: number;
  hash: string;
}

// Function to fetch datasets from your backend API.
export const fetchDatasets = async (): Promise<Dataset[]> => {
  console.log("Fetching datasets from:", `${BACKEND_URL}/api/datasets`);

  // Mock data for development
  const mockDatasets: Dataset[] = [
    {
      id: "1",
      name: "EEG Dataset 1",
      source: "OpenNeuro",
      description: "Sample EEG dataset from OpenNeuro.",
      dataType: "EEG",
      metadata: {
        samplingRate: 250,
        channels: 64,
        duration: 3600,
        subject: {
          anonymizedId: "SUB001",
          age: 25,
          gender: "F",
        },
        permissions: {
          isPublic: true,
          authorizedResearchers: ["0x123..."],
          sharingPreferences: {
            allowAnalysis: true,
            allowSharing: true,
            requiresConsent: false,
          },
        },
      },
      owner: "0x456...",
      timestamp: Date.now(),
      hash: "0x789...",
    },
    {
      id: "2",
      name: "ECG Study Data",
      source: "CardioBank",
      description: "Cardiovascular research data collection",
      dataType: "ECG",
      metadata: {
        samplingRate: 500,
        channels: 12,
        duration: 1800,
        subject: {
          anonymizedId: "SUB002",
          age: 30,
          gender: "M",
        },
        permissions: {
          isPublic: false,
          authorizedResearchers: ["0x123...", "0x456..."],
          sharingPreferences: {
            allowAnalysis: true,
            allowSharing: false,
            requiresConsent: true,
          },
        },
      },
      owner: "0x789...",
      timestamp: Date.now(),
      hash: "0xabc...",
    },
    {
      id: "3",
      name: "Sleep Study EOG",
      source: "SleepLab",
      description: "Eye movement data during sleep cycles",
      dataType: "EOG",
      metadata: {
        samplingRate: 100,
        channels: 4,
        duration: 28800,
        subject: {
          anonymizedId: "SUB003",
          age: 28,
          gender: "F",
        },
        permissions: {
          isPublic: true,
          authorizedResearchers: [],
          sharingPreferences: {
            allowAnalysis: true,
            allowSharing: true,
            requiresConsent: false,
          },
        },
      },
      owner: "0xdef...",
      timestamp: Date.now(),
      hash: "0xghi...",
    },
  ];

  // In a real implementation, we would fetch from the API
  // const response = await fetch(`${BACKEND_URL}/api/datasets`);
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   console.error("Fetch error. Status:", response.status, response.statusText);
  //   console.error("Response text:", errorText);
  //   throw new Error("Failed to fetch datasets: " + response.statusText);
  // }
  // const data: Dataset[] = await response.json();

  console.log("Datasets fetched:", mockDatasets);
  return mockDatasets;
};

// Function to upload a dataset using the NeuroDataProvenance contract.
export const uploadDataset = async (
  datasetId: string,
  origin: string,
  license: string,
): Promise<{ success: boolean; message: string; transactionHash?: string }> => {
  console.log("uploadDataset called with:", { datasetId, origin, license });

  if (!window.ethereum) {
    console.error("MetaMask not detected on window");
    return {
      success: false,
      message: "MetaMask not detected. Please install MetaMask to continue.",
    };
  }

  console.log("MetaMask detected:", window.ethereum);

  // Create a new Web3 instance using the injected provider.
  let web3: Web3;
  try {
    web3 = new Web3(window.ethereum);
    console.log("Web3 instance created:", web3);
  } catch (error) {
    console.error("Error creating Web3 instance:", error);
    return {
      success: false,
      message: "Failed to initialize Web3. Please try again.",
    };
  }

  // Request accounts from MetaMask.
  try {
    console.log("Requesting accounts from MetaMask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Accounts request successful");
  } catch (error: unknown) {
    console.error("Error requesting accounts:", error);
    // Type guard to check if error matches our MetaMaskError interface
    if (error && typeof error === "object" && "code" in error) {
      const mmError = error as MetaMaskError;
      // Check if user rejected the request
      if (mmError.code === 4001) {
        return {
          success: false,
          message: "You declined to connect your wallet. Please try again.",
        };
      }
    }
    return {
      success: false,
      message: "Failed to connect to your wallet. Please try again.",
    };
  }

  // Get the list of accounts.
  let accounts: string[];
  try {
    accounts = await web3.eth.getAccounts();
    console.log("Accounts retrieved:", accounts);
    if (!accounts || accounts.length === 0) {
      return {
        success: false,
        message:
          "No accounts available. Please make sure your wallet is connected.",
      };
    }
  } catch (error) {
    console.error("Error retrieving accounts:", error);
    return {
      success: false,
      message: "Failed to retrieve your account. Please try again.",
    };
  }

  // Instantiate the contract.
  let contract;
  try {
    console.log(
      "Instantiating contract with address:",
      neuroDataProvenance.address,
    );
    console.log("Using ABI:", JSON.stringify(neuroDataProvenance.abi, null, 2));
    contract = new web3.eth.Contract(
      neuroDataProvenance.abi,
      neuroDataProvenance.address,
    );
    console.log("Contract instance created:", contract);
    console.log("Available contract methods:", Object.keys(contract.methods));
    console.log("Full contract methods:", contract.methods);
  } catch (error) {
    console.error("Error instantiating contract:", error);
    return {
      success: false,
      message: "Failed to connect to the smart contract. Please try again.",
    };
  }

  // Check that the uploadDataset function exists.
  if (!contract.methods.uploadDataset) {
    console.error("uploadDataset function is not available on the contract.");
    console.error("Available methods:", Object.keys(contract.methods));
    return {
      success: false,
      message: "Contract method not available. Please try again later.",
    };
  }

  // Call the uploadDataset function.
  try {
    console.log("Calling uploadDataset on contract...");
    const tx = await contract.methods
      .uploadDataset(datasetId, origin, license)
      .send({ from: accounts[0] });
    console.log("Transaction successful, tx:", tx);
    return {
      success: true,
      message: "Dataset uploaded successfully!",
      transactionHash: tx.transactionHash,
    };
  } catch (error: unknown) {
    console.error("Error executing contract method uploadDataset:", error);
    // Type guard to check if error matches our MetaMaskError interface
    if (error && typeof error === "object" && "code" in error) {
      const mmError = error as MetaMaskError;
      // Check if user rejected the transaction
      if (mmError.code === 4001) {
        return {
          success: false,
          message: "You declined to sign the transaction. Upload cancelled.",
        };
      }
    }
    return {
      success: false,
      message: "Failed to upload dataset. Please try again.",
    };
  }
};
