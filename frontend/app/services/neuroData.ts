import {
  NeuroDataResponse,
  SubjectsResponse,
  SessionsResponse,
} from "../types/neuro";

const API_BASE_URL = "http://localhost:5001/api/neuro";

export const fetchEEGData = async (
  subjectId: string,
): Promise<NeuroDataResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/eeg/${subjectId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching EEG data:", error);
    return {
      success: false,
      error: "Failed to fetch EEG data",
    };
  }
};

export const fetchEOGData = async (
  version: string,
  participant: string,
  session?: string,
): Promise<NeuroDataResponse> => {
  try {
    const url = new URL(`${API_BASE_URL}/eog/${version}/${participant}`);
    if (session) {
      url.searchParams.append("session", session);
    }
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching EOG data:", error);
    return {
      success: false,
      error: "Failed to fetch EOG data",
    };
  }
};

export const fetchAvailableSubjects = async (): Promise<SubjectsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/eeg/subjects`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available subjects:", error);
    return {
      success: false,
      error: "Failed to fetch available subjects",
    };
  }
};

export const fetchAvailableSessions = async (
  version: string,
  participant: string,
): Promise<SessionsResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/eog/${version}/${participant}/sessions`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available sessions:", error);
    return {
      success: false,
      error: "Failed to fetch available sessions",
    };
  }
};
