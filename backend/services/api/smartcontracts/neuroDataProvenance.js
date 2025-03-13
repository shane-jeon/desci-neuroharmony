const express = require("express");
const router = express.Router();

// Use a fallback to get the Web3 constructor
const Web3 = require("web3");

// **Change this line:**
// const config = contractsConfig.NeuroGrantDAO;
const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.NeuroDataProvenance; // Use NeuroDataProvenance here
const contractAddress = config.address;
const contractABI = config.abi;

const uploadDataset = async (req, res) => {
  const { datasetId, origin, license } = req.body;

  if (!datasetId || !origin || !license) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  try {
    const web3 = new Web3(process.env.RPC_URL || "http://127.0.0.1:8545");
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await web3.eth.getAccounts();
    const transaction = await contract.methods
      .uploadDataset(datasetId, origin, license)
      .send({ from: accounts[0] });

    res.json({
      success: true,
      transactionHash: transaction.transactionHash,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to upload dataset",
    });
  }
};

// Add the route to the router
router.post("/upload", uploadDataset);

// Export the router
module.exports = router;
