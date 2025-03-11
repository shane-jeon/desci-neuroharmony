const { ethers } = require("hardhat");

async function main() {
  try {
    console.log("Starting deployment script...");
    const signers = await ethers.getSigners();
    console.log(
      "Available signers:",
      signers.map((s) => s.address),
    );
    const [deployer] = signers;
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy NeuroDataProvenance
    const NeuroDataProvenanceFactory = await ethers.getContractFactory(
      "NeuroDataProvenance",
    );
    console.log("NeuroDataProvenance Contract Factory loaded.");
    const neuroDataProvenance = await NeuroDataProvenanceFactory.deploy();
    await neuroDataProvenance.waitForDeployment();
    const neuroDataProvenanceAddress = await neuroDataProvenance.getAddress();
    console.log(
      "NeuroDataProvenance deployed to address:",
      neuroDataProvenanceAddress,
    );

    // Deploy NeuroGrantDAO
    const NeuroGrantDAOFactory = await ethers.getContractFactory(
      "NeuroGrantDAO",
    );
    console.log("NeuroGrantDAO Contract Factory loaded.");
    const neuroGrantDAO = await NeuroGrantDAOFactory.deploy();
    await neuroGrantDAO.waitForDeployment();
    const neuroGrantDAOAddress = await neuroGrantDAO.getAddress();
    console.log("NeuroGrantDAO deployed to address:", neuroGrantDAOAddress);

    // Deploy NEUROToken
    const NEUROTokenFactory = await ethers.getContractFactory("NEUROToken");
    console.log("NEUROToken Contract Factory loaded.");
    const neuroToken = await NEUROTokenFactory.deploy();
    await neuroToken.waitForDeployment();
    const neuroTokenAddress = await neuroToken.getAddress();
    console.log("NEUROToken deployed to address:", neuroTokenAddress);

    // Deploy ResearchCollaboration
    const ResearchCollaborationFactory = await ethers.getContractFactory(
      "ResearchCollaboration",
    );
    console.log("ResearchCollaboration Contract Factory loaded.");
    const researchCollaboration = await ResearchCollaborationFactory.deploy();
    await researchCollaboration.waitForDeployment();
    const researchCollaborationAddress =
      await researchCollaboration.getAddress();
    console.log(
      "ResearchCollaboration deployed to address:",
      researchCollaborationAddress,
    );

    // Deploy ResearchFunding
    const ResearchFundingFactory = await ethers.getContractFactory(
      "ResearchFunding",
    );
    console.log("ResearchFunding Contract Factory loaded.");
    const researchFunding = await ResearchFundingFactory.deploy();
    await researchFunding.waitForDeployment();
    const researchFundingAddress = await researchFunding.getAddress();
    console.log("ResearchFunding deployed to address:", researchFundingAddress);

    // Deploy ScienceToken
    const ScienceTokenFactory = await ethers.getContractFactory("ScienceToken");
    console.log("ScienceToken Contract Factory loaded.");
    const scienceToken = await ScienceTokenFactory.deploy();
    await scienceToken.waitForDeployment();
    const scienceTokenAddress = await scienceToken.getAddress();
    console.log("ScienceToken deployed to address:", scienceTokenAddress);

    // Output all deployed contract addresses
    const addresses = {
      NeuroDataProvenance: neuroDataProvenanceAddress,
      NeuroGrantDAO: neuroGrantDAOAddress,
      NEUROToken: neuroTokenAddress,
      ResearchCollaboration: researchCollaborationAddress,
      ResearchFunding: researchFundingAddress,
      ScienceToken: scienceTokenAddress,
    };

    console.log("All deployed contract addresses:", addresses);

    // Update the contract configuration file
    const fs = require("fs");
    const path = require("path");
    const configPath = path.join(
      __dirname,
      "..",
      "config",
      "contracts.config.json",
    );
    const config = require(configPath);

    // Update addresses in config
    config.NeuroDataProvenance.address = neuroDataProvenanceAddress;
    config.NeuroGrantDAO.address = neuroGrantDAOAddress;
    config.NEUROToken.address = neuroTokenAddress;
    config.ResearchCollaboration.address = researchCollaborationAddress;
    config.ResearchFunding.address = researchFundingAddress;
    config.ScienceToken.address = scienceTokenAddress;

    // Write updated config back to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log("Contract configuration updated successfully");
  } catch (error) {
    console.error("Error during contract deployment:", error);
    process.exit(1);
  }
}

main();
