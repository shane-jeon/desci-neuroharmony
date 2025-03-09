const express = require("express");
const router = express.Router();

// Use a fallback to get the Web3 constructor
const Web3Imported = require("web3");
const Web3 = Web3Imported.default || Web3Imported;

// **Change this line:**
// const config = contractsConfig.NeuroGrantDAO;
const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.NeuroDataProvenance; // Use NeuroDataProvenance here
const contractAddress = config.address;
const contractABI = config.abi;

const web3 = new Web3("http://localhost:8545");

// Example endpoint: Create a proposal (or other functionality, e.g., upload dataset)
router.post("/upload-dataset", async (req, res) => {
  const { datasetId, origin, license } = req.body;
  if (!datasetId || !origin || !license) {
    return res
      .status(400)
      .json({ error: "Dataset ID, origin and license are required" });
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods
      .uploadDataset(datasetId, origin, license)
      .send({ from: accounts[0] });
    res.status(200).json({ transactionHash: transaction.transactionHash });
  } catch (error) {
    console.error("Error in NeuroDataProvenance endpoint:", error);
    res.status(500).json({ error: "Failed to upload dataset" });
  }
});

module.exports = router;
