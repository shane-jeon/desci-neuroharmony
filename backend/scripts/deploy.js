const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function updateConfig(contractName, address, artifact) {
  try {
    const configPath = path.join(
      __dirname,
      "..",
      "config",
      "contracts.config.json",
    );
    let config = {};

    // Try to read existing config
    try {
      const existingConfig = fs.readFileSync(configPath, "utf8");
      config = JSON.parse(existingConfig);
    } catch (error) {
      console.log(
        "No existing config found or invalid JSON, creating new config",
      );
    }

    // Update or create the contract entry
    config[contractName] = {
      address: address,
      abi: artifact.abi,
    };

    // Write the updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Updated configuration for ${contractName}`);
  } catch (error) {
    console.error(`Error updating config for ${contractName}:`, error);
    throw error;
  }
}

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

    // Deploy NEUROToken first
    console.log("\nDeploying NEUROToken...");
    const NEUROTokenFactory = await ethers.getContractFactory("NEUROToken");
    const neuroToken = await NEUROTokenFactory.deploy();
    await neuroToken.waitForDeployment();
    const neuroTokenAddress = await neuroToken.getAddress();
    console.log("NEUROToken deployed to:", neuroTokenAddress);
    await updateConfig(
      "NEUROToken",
      neuroTokenAddress,
      await artifacts.readArtifact("NEUROToken"),
    );

    // Then deploy NeuroGrantDAO with NEUROToken address
    console.log("\nDeploying NeuroGrantDAO...");
    const NeuroGrantDAOFactory = await ethers.getContractFactory(
      "NeuroGrantDAO",
    );
    const neuroGrantDAO = await NeuroGrantDAOFactory.deploy(neuroTokenAddress);
    await neuroGrantDAO.waitForDeployment();
    const neuroGrantDAOAddress = await neuroGrantDAO.getAddress();
    console.log("NeuroGrantDAO deployed to:", neuroGrantDAOAddress);
    await updateConfig(
      "NeuroGrantDAO",
      neuroGrantDAOAddress,
      await artifacts.readArtifact("NeuroGrantDAO"),
    );

    // Deploy NeuroDataProvenance
    console.log("\nDeploying NeuroDataProvenance...");
    const NeuroDataProvenanceFactory = await ethers.getContractFactory(
      "NeuroDataProvenance",
    );
    const neuroDataProvenance = await NeuroDataProvenanceFactory.deploy();
    await neuroDataProvenance.waitForDeployment();
    const neuroDataProvenanceAddress = await neuroDataProvenance.getAddress();
    console.log("NeuroDataProvenance deployed to:", neuroDataProvenanceAddress);
    await updateConfig(
      "NeuroDataProvenance",
      neuroDataProvenanceAddress,
      await artifacts.readArtifact("NeuroDataProvenance"),
    );

    // Deploy ResearchCollaboration
    console.log("\nDeploying ResearchCollaboration...");
    const ResearchCollaborationFactory = await ethers.getContractFactory(
      "ResearchCollaboration",
    );
    const researchCollaboration = await ResearchCollaborationFactory.deploy();
    await researchCollaboration.waitForDeployment();
    const researchCollaborationAddress =
      await researchCollaboration.getAddress();
    console.log(
      "ResearchCollaboration deployed to:",
      researchCollaborationAddress,
    );
    await updateConfig(
      "ResearchCollaboration",
      researchCollaborationAddress,
      await artifacts.readArtifact("ResearchCollaboration"),
    );

    // Deploy ResearchFunding
    console.log("\nDeploying ResearchFunding...");
    const ResearchFundingFactory = await ethers.getContractFactory(
      "ResearchFunding",
    );
    const researchFunding = await ResearchFundingFactory.deploy();
    await researchFunding.waitForDeployment();
    const researchFundingAddress = await researchFunding.getAddress();
    console.log("ResearchFunding deployed to:", researchFundingAddress);
    await updateConfig(
      "ResearchFunding",
      researchFundingAddress,
      await artifacts.readArtifact("ResearchFunding"),
    );

    // Deploy ScienceToken
    console.log("\nDeploying ScienceToken...");
    const ScienceTokenFactory = await ethers.getContractFactory("ScienceToken");
    const scienceToken = await ScienceTokenFactory.deploy();
    await scienceToken.waitForDeployment();
    const scienceTokenAddress = await scienceToken.getAddress();
    console.log("ScienceToken deployed to:", scienceTokenAddress);
    await updateConfig(
      "ScienceToken",
      scienceTokenAddress,
      await artifacts.readArtifact("ScienceToken"),
    );

    console.log(
      "\nAll contracts deployed and configuration updated successfully!",
    );

    // Output final addresses for verification
    console.log("\nDeployed Contract Addresses:");
    console.log("NEUROToken:", neuroTokenAddress);
    console.log("NeuroGrantDAO:", neuroGrantDAOAddress);
    console.log("NeuroDataProvenance:", neuroDataProvenanceAddress);
    console.log("ResearchCollaboration:", researchCollaborationAddress);
    console.log("ResearchFunding:", researchFundingAddress);
    console.log("ScienceToken:", scienceTokenAddress);

    // Update frontend environment variables
    console.log("\nUpdating frontend environment variables...");
    require("./update-frontend-config");
    console.log("Frontend environment variables updated successfully!");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

main();
