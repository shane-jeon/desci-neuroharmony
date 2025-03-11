const { ethers } = require("hardhat");
const contractsConfig = require("../config/contracts.config.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting tokens with account:", deployer.address);

  // Get the NEUROToken contract
  const NEUROToken = await ethers.getContractFactory("NEUROToken");
  const neuroToken = await NEUROToken.attach(
    contractsConfig.NEUROToken.address,
  );

  console.log(
    "NEUROToken contract address:",
    contractsConfig.NEUROToken.address,
  );

  // Mint 10000 tokens (10000 * 10^18) - increased amount for testing
  const amount = ethers.parseEther("10000");
  console.log(
    "Attempting to mint",
    ethers.formatEther(amount),
    "NEURO tokens...",
  );

  try {
    const tx = await neuroToken.rewardUser(deployer.address, amount);
    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction confirmation...");
    await tx.wait();
    console.log("Minting successful!");

    // Check balance
    const balance = await neuroToken.balanceOf(deployer.address);
    console.log("New balance:", ethers.formatEther(balance), "NEURO");
  } catch (error) {
    console.error("Error during minting:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
