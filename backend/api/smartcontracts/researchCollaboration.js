const express = require("express");
const router = express.Router();
const Web3Imported = require("web3");
const Web3 = Web3Imported.default || Web3Imported;

const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.ResearchCollaboration;
const contractAddress = config.address;
const contractABI = config.abi;

const web3 = new Web3("http://localhost:8545");

// Example endpoint: Create a project
router.post("/create-project", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods
      .createProject(title, description)
      .send({ from: accounts[0] });
    res.status(200).json({ transactionHash: transaction.transactionHash });
  } catch (error) {
    console.error("Error in ResearchCollaboration endpoint:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

module.exports = router;
