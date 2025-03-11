const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Minting tokens with account:", deployer.address);

  // Get the NEUROToken contract
  const NEUROToken = await ethers.getContractFactory("NEUROToken");
  const neuroToken = await NEUROToken.attach(
    "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
  );

  // Mint 1000 tokens (1000 * 10^18)
  const amount = ethers.parseEther("1000");
  const tx = await neuroToken.rewardUser(deployer.address, amount);
  await tx.wait();

  console.log("Minted 1000 NEURO tokens to:", deployer.address);

  // Check balance
  const balance = await neuroToken.balanceOf(deployer.address);
  console.log("New balance:", ethers.formatEther(balance), "NEURO");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
