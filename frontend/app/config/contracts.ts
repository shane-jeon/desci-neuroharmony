import { AbiItem } from "web3-utils";

// Contract addresses from environment variables
const NEURO_DATA_PROVENANCE_ADDRESS =
  process.env.NEXT_PUBLIC_NEURO_DATA_PROVENANCE_ADDRESS || "";
const NEURO_GRANT_DAO_ADDRESS =
  process.env.NEXT_PUBLIC_NEURO_GRANT_DAO_ADDRESS || "";
const NEURO_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_NEURO_TOKEN_ADDRESS || "";
const RESEARCH_COLLABORATION_ADDRESS =
  process.env.NEXT_PUBLIC_RESEARCH_COLLABORATION_ADDRESS || "";
const RESEARCH_FUNDING_ADDRESS =
  process.env.NEXT_PUBLIC_RESEARCH_FUNDING_ADDRESS || "";
const SCIENCE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_SCIENCE_TOKEN_ADDRESS || "";

// API endpoints from environment variables
export const API_ENDPOINTS = {
  backend: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8545",
  python: process.env.NEXT_PUBLIC_PYTHON_URL || "http://localhost:5000",
};

// Contract configurations
export const contractsConfig = {
  neuroDataProvenance: {
    address: NEURO_DATA_PROVENANCE_ADDRESS,
    abi: [
      {
        inputs: [
          { name: "datasetId", type: "string" },
          { name: "origin", type: "string" },
          { name: "license", type: "string" },
        ],
        name: "uploadDataset",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as AbiItem[],
  },
  neuroGrantDAO: {
    address: NEURO_GRANT_DAO_ADDRESS,
    abi: [
      {
        inputs: [
          { name: "proposalId", type: "uint256" },
          { name: "votes", type: "uint256" },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "proposalCount",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ name: "proposalId", type: "uint256" }],
        name: "proposals",
        outputs: [
          { name: "id", type: "uint256" },
          { name: "description", type: "string" },
          { name: "budget", type: "uint256" },
          { name: "votes", type: "uint256" },
          { name: "proposer", type: "address" },
          { name: "executed", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { name: "description", type: "string" },
          { name: "budget", type: "uint256" },
        ],
        name: "createProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "proposalId", type: "uint256" }],
        name: "executeProposal",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "user", type: "address" }],
        name: "getVotingPower",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { name: "proposalId", type: "uint256" },
          { name: "user", type: "address" },
        ],
        name: "hasUserVoted",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ] as AbiItem[],
  },
  neuroToken: {
    address: NEURO_TOKEN_ADDRESS,
    abi: [
      {
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "stake",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "unstake",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "account", type: "address" }],
        name: "getStakedAmount",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ] as AbiItem[],
  },
  researchCollaboration: {
    address: RESEARCH_COLLABORATION_ADDRESS,
    abi: [
      {
        inputs: [],
        name: "projectCount",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ name: "projectId", type: "uint256" }],
        name: "getProject",
        outputs: [
          { name: "", type: "string" }, // title
          { name: "", type: "string" }, // description
          { name: "", type: "address[]" }, // contributors
          { name: "", type: "string[]" }, // documents
          { name: "", type: "bool" }, // isCompleted
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { name: "title", type: "string" },
          { name: "description", type: "string" },
        ],
        name: "createProject",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { name: "projectId", type: "uint256" },
          { name: "researcher", type: "address" },
        ],
        name: "addResearcher",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { name: "projectId", type: "uint256" },
          { name: "document", type: "string" },
        ],
        name: "addDocument",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ name: "projectId", type: "uint256" }],
        name: "completeProject",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as AbiItem[],
  },
  researchFunding: {
    address: RESEARCH_FUNDING_ADDRESS,
    abi: [
      {
        inputs: [
          { name: "projectId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
        name: "fundProject",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as AbiItem[],
  },
  scienceToken: {
    address: SCIENCE_TOKEN_ADDRESS,
    abi: [
      {
        inputs: [
          { name: "to", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ] as AbiItem[],
  },
};
