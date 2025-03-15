"use client";

import React from "react";
import { EEGCard } from "./EEGCard";
import { EOGCard } from "./EOGCard";
import { ECGCard } from "./ECGCard";

interface NeuroDataCardProps {
  type: "eeg" | "eog" | "ecg";
  subjectId?: string;
  version?: string;
}

const NeuroDataCard: React.FC<NeuroDataCardProps> = ({
  type,
  subjectId,
  version: initialVersion,
}) => {
  switch (type) {
    case "eeg":
      return <EEGCard subjectId={subjectId} />;
    case "eog":
      return <EOGCard initialVersion={initialVersion} />;
    case "ecg":
      return <ECGCard />;
    default:
      return null;
  }
};

export default NeuroDataCard;
