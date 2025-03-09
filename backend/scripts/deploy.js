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
    console.log("Deploying NeuroDataProvenance...");
    if (
      neuroDataProvenance.deployTransaction &&
      typeof neuroDataProvenance.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for NeuroDataProvenance deployment transaction to be mined...",
      );
      await neuroDataProvenance.deployTransaction.wait();
      console.log("NeuroDataProvenance deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for NeuroDataProvenance; assuming already deployed.",
      );
    }
    const neuroDataProvenanceAddress =
      neuroDataProvenance.address || neuroDataProvenance.target;
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
    console.log("Deploying NeuroGrantDAO...");
    if (
      neuroGrantDAO.deployTransaction &&
      typeof neuroGrantDAO.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for NeuroGrantDAO deployment transaction to be mined...",
      );
      await neuroGrantDAO.deployTransaction.wait();
      console.log("NeuroGrantDAO deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for NeuroGrantDAO; assuming already deployed.",
      );
    }
    const neuroGrantDAOAddress = neuroGrantDAO.address || neuroGrantDAO.target;
    console.log("NeuroGrantDAO deployed to address:", neuroGrantDAOAddress);

    // Deploy NEUROToken
    const NEUROTokenFactory = await ethers.getContractFactory("NEUROToken");
    console.log("NEUROToken Contract Factory loaded.");
    const neuroToken = await NEUROTokenFactory.deploy();
    console.log("Deploying NEUROToken...");
    if (
      neuroToken.deployTransaction &&
      typeof neuroToken.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for NEUROToken deployment transaction to be mined...",
      );
      await neuroToken.deployTransaction.wait();
      console.log("NEUROToken deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for NEUROToken; assuming already deployed.",
      );
    }
    const neuroTokenAddress = neuroToken.address || neuroToken.target;
    console.log("NEUROToken deployed to address:", neuroTokenAddress);

    // Deploy ResearchCollaboration
    const ResearchCollaborationFactory = await ethers.getContractFactory(
      "ResearchCollaboration",
    );
    console.log("ResearchCollaboration Contract Factory loaded.");
    const researchCollaboration = await ResearchCollaborationFactory.deploy();
    console.log("Deploying ResearchCollaboration...");
    if (
      researchCollaboration.deployTransaction &&
      typeof researchCollaboration.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for ResearchCollaboration deployment transaction to be mined...",
      );
      await researchCollaboration.deployTransaction.wait();
      console.log("ResearchCollaboration deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for ResearchCollaboration; assuming already deployed.",
      );
    }
    const researchCollaborationAddress =
      researchCollaboration.address || researchCollaboration.target;
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
    console.log("Deploying ResearchFunding...");
    if (
      researchFunding.deployTransaction &&
      typeof researchFunding.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for ResearchFunding deployment transaction to be mined...",
      );
      await researchFunding.deployTransaction.wait();
      console.log("ResearchFunding deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for ResearchFunding; assuming already deployed.",
      );
    }
    const researchFundingAddress =
      researchFunding.address || researchFunding.target;
    console.log("ResearchFunding deployed to address:", researchFundingAddress);

    // Deploy ScienceToken
    const ScienceTokenFactory = await ethers.getContractFactory("ScienceToken");
    console.log("ScienceToken Contract Factory loaded.");
    const scienceToken = await ScienceTokenFactory.deploy();
    console.log("Deploying ScienceToken...");
    if (
      scienceToken.deployTransaction &&
      typeof scienceToken.deployTransaction.wait === "function"
    ) {
      console.log(
        "Waiting for ScienceToken deployment transaction to be mined...",
      );
      await scienceToken.deployTransaction.wait();
      console.log("ScienceToken deployment transaction mined.");
    } else {
      console.log(
        "No deployTransaction found for ScienceToken; assuming already deployed.",
      );
    }
    const scienceTokenAddress = scienceToken.address || scienceToken.target;
    console.log("ScienceToken deployed to address:", scienceTokenAddress);

    // Output all deployed contract addresses
    console.log("All deployed contract addresses:");
    console.log({
      NeuroDataProvenance: neuroDataProvenanceAddress,
      NeuroGrantDAO: neuroGrantDAOAddress,
      NEUROToken: neuroTokenAddress,
      ResearchCollaboration: researchCollaborationAddress,
      ResearchFunding: researchFundingAddress,
      ScienceToken: scienceTokenAddress,
    });
  } catch (error) {
    console.error("Error during contract deployment:", error);
  } finally {
    process.exit(0);
  }
}

main();
