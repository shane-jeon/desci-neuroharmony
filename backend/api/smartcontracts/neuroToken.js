const express = require("express");
const router = express.Router();
const Web3Imported = require("web3");
const Web3 = Web3Imported.default || Web3Imported;

const contractsConfig = require("../../config/contracts.config.json");
const config = contractsConfig.NEUROToken;
const contractAddress = config.address;
const contractABI = config.abi;

const web3 = new Web3("http://localhost:8545");

// Example endpoint: Reward a user
router.post("/reward", async (req, res) => {
  const { user, amount } = req.body;
  if (!user || !amount) {
    return res.status(400).json({ error: "User and amount are required" });
  }
  try {
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods
      .rewardUser(user, amount)
      .send({ from: accounts[0] });
    res.status(200).json({ transactionHash: transaction.transactionHash });
  } catch (error) {
    console.error("Error in NEUROToken endpoint:", error);
    res.status(500).json({ error: "Transaction failed" });
  }
});

module.exports = router;
