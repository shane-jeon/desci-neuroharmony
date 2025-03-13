const express = require("express");
const router = express.Router();
const Web3Imported = require("web3");
const Web3 = Web3Imported.default || Web3Imported;

const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.ResearchFunding;
const contractAddress = config.address;
const contractABI = config.abi;

const web3 = new Web3("http://localhost:8545");

// Example endpoint: Create a grant
router.post("/create-grant", async (req, res) => {
  const { title, description, amount } = req.body;
  if (!title || !description || !amount) {
    return res
      .status(400)
      .json({ error: "Title, description and amount are required" });
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods
      .createGrant(title, description, amount)
      .send({ from: accounts[0] });
    res.status(200).json({ transactionHash: transaction.transactionHash });
  } catch (error) {
    console.error("Error in ResearchFunding endpoint:", error);
    res.status(500).json({ error: "Failed to create grant" });
  }
});

module.exports = router;
