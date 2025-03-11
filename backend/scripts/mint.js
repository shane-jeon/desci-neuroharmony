const { ethers } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const NEUROToken = await ethers.getContractFactory("NEUROToken");
    const neuroToken = await NEUROToken.attach(
      require("../config/contracts.config.json").NEUROToken.address,
    );

    const amount = ethers.parseEther("10000.0");
    const tx = await neuroToken.rewardUser(deployer.address, amount);
    await tx.wait();

    const balance = await neuroToken.balanceOf(deployer.address);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
