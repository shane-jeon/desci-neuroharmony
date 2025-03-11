import { AbiItem } from "web3-utils";
import contractsConfig from "../../../backend/config/contracts.config.json";

// Adjust types as needed (using any or a proper interface)
export const neuroDataProvenance = {
  address: contractsConfig.NeuroDataProvenance.address,
  abi: contractsConfig.NeuroDataProvenance.abi as AbiItem[],
};

export const neuroGrantDAO = {
  address: contractsConfig.NeuroGrantDAO.address,
  abi: contractsConfig.NeuroGrantDAO.abi as AbiItem[],
};

export const neuroToken = {
  address: contractsConfig.NEUROToken.address,
  abi: contractsConfig.NEUROToken.abi as AbiItem[],
};

export const researchCollaboration = {
  address: contractsConfig.ResearchCollaboration.address,
  abi: contractsConfig.ResearchCollaboration.abi as AbiItem[],
};

export const researchFunding = {
  address: contractsConfig.ResearchFunding.address,
  abi: contractsConfig.ResearchFunding.abi as AbiItem[],
};

export const scienceToken = {
  address: contractsConfig.ScienceToken.address,
  abi: contractsConfig.ScienceToken.abi as AbiItem[],
};
