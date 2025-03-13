const fs = require("fs");
const path = require("path");

async function updateFrontendConfig() {
  try {
    // Read backend config
    const backendConfigPath = path.join(
      __dirname,
      "..",
      "config",
      "contracts.config.json",
    );
    const backendConfig = JSON.parse(
      fs.readFileSync(backendConfigPath, "utf8"),
    );

    // Read frontend env file
    const frontendEnvPath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      ".env.local",
    );
    let frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");

    // Update contract addresses
    const updates = {
      NEXT_PUBLIC_NEURO_DATA_PROVENANCE_ADDRESS:
        backendConfig.NeuroDataProvenance.address,
      NEXT_PUBLIC_NEURO_GRANT_DAO_ADDRESS: backendConfig.NeuroGrantDAO.address,
      NEXT_PUBLIC_NEURO_TOKEN_ADDRESS: backendConfig.NEUROToken.address,
      NEXT_PUBLIC_RESEARCH_COLLABORATION_ADDRESS:
        backendConfig.ResearchCollaboration.address,
      NEXT_PUBLIC_RESEARCH_FUNDING_ADDRESS:
        backendConfig.ResearchFunding.address,
      NEXT_PUBLIC_SCIENCE_TOKEN_ADDRESS: backendConfig.ScienceToken.address,
    };

    // Update each environment variable
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`${key}=.*`);
      if (frontendEnv.match(regex)) {
        frontendEnv = frontendEnv.replace(regex, `${key}=${value}`);
      } else {
        frontendEnv += `\n${key}=${value}`;
      }
    });

    // Write updated env file
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    console.log("Frontend environment variables updated successfully!");
  } catch (error) {
    console.error("Error updating frontend config:", error);
    process.exit(1);
  }
}

updateFrontendConfig();
