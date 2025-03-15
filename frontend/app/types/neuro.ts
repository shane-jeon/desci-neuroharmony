export interface NeuroData {
  data: number[][];
  sampling_rate: number;
  channel_names: string[];
  units: string;
  start_time: string;
}

export interface EEGData extends NeuroData {
  type: "eeg";
  subject_id: string;
}

export interface EOGData extends NeuroData {
  type: "eog";
  version: string;
  participant: string;
  session?: string;
}

export interface NeuroDataResponse {
  success: boolean;
  data?: NeuroData;
  error?: string;
}

export interface SubjectsResponse {
  success: boolean;
  subjects?: string[];
  error?: string;
}

export interface SessionsResponse {
  success: boolean;
  sessions?: string[];
  error?: string;
}
