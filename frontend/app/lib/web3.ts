import { AbiItem } from "web3-utils";
import { contractsConfig, API_ENDPOINTS } from "../config/contracts";

// Extract contract configurations and cast ABIs appropriately
export const neuroDataProvenance = {
  address: contractsConfig.neuroDataProvenance.address,
  abi: contractsConfig.neuroDataProvenance.abi as AbiItem[],
};

export const neuroGrantDAO = {
  address: contractsConfig.neuroGrantDAO.address,
  abi: contractsConfig.neuroGrantDAO.abi as AbiItem[],
};

export const neuroToken = {
  address: contractsConfig.neuroToken.address,
  abi: contractsConfig.neuroToken.abi as AbiItem[],
};

export const researchCollaboration = {
  address: contractsConfig.researchCollaboration.address,
  abi: contractsConfig.researchCollaboration.abi as AbiItem[],
};

export const researchFunding = {
  address: contractsConfig.researchFunding.address,
  abi: contractsConfig.researchFunding.abi as AbiItem[],
};

export const scienceToken = {
  address: contractsConfig.scienceToken.address,
  abi: contractsConfig.scienceToken.abi as AbiItem[],
};

// Define Dataset interface
export interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  dataType: "ECG" | "EEG" | "EOG";
  metadata: {
    samplingRate?: number;
    channels?: number;
    duration?: number;
    permissions: {
      isPublic: boolean;
    };
  };
}

// API functions
export const fetchDatasets = async (): Promise<Dataset[]> => {
  try {
    console.log(
      "Fetching datasets from:",
      `${API_ENDPOINTS.backend}/api/datasets`,
    );
    const response = await fetch(`${API_ENDPOINTS.backend}/api/datasets`);
    if (!response.ok) {
      console.error(
        "Failed to fetch datasets:",
        response.status,
        response.statusText,
      );
      throw new Error("Failed to fetch datasets");
    }
    const data = await response.json();
    console.log("Received datasets data:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching datasets:", error);
    return [];
  }
};

export const uploadDataset = async (
  datasetId: string,
  origin: string,
  license: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.backend}/api/datasets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datasetId, origin, license }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error uploading dataset:", error);
    return {
      success: false,
      message: "Failed to upload dataset. Please try again.",
    };
  }
};
