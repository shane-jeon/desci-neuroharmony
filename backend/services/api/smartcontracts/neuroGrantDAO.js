const express = require("express");
const router = express.Router();

// Use a fallback to get the Web3 constructor
const Web3Imported = require("web3");
const Web3 = Web3Imported.default || Web3Imported;

const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.NeuroGrantDAO;
const contractAddress = config.address;
const contractABI = config.abi;

const web3 = new Web3("http://localhost:8545");

// Example endpoint: Create a proposal
router.post("/create-proposal", async (req, res) => {
  const { description, budget } = req.body;
  if (!description || !budget) {
    return res
      .status(400)
      .json({ error: "Description and budget are required" });
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods
      .createProposal(description, budget)
      .send({ from: accounts[0] });
    res.status(200).json({ transactionHash: transaction.transactionHash });
  } catch (error) {
    console.error("Error in NeuroGrantDAO endpoint:", error);
    res.status(500).json({ error: "Failed to create proposal" });
  }
});

module.exports = router;
