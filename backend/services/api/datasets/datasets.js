const express = require("express");
const router = express.Router();

// Mock dataset data
const mockDatasets = [
  {
    id: "1",
    name: "EEG Dataset 1",
    source: "OpenNeuro",
    description: "Sample EEG dataset from OpenNeuro.",
    dataType: "EEG",
    metadata: {
      samplingRate: 1000,
      channels: 64,
      duration: 3600,
      permissions: {
        isPublic: true,
      },
    },
  },
  {
    id: "2",
    name: "ECG Dataset 1",
    source: "IEEG Portal",
    description: "ECG data from IEEG Portal.",
    dataType: "ECG",
    metadata: {
      samplingRate: 500,
      channels: 12,
      duration: 1800,
      permissions: {
        isPublic: false,
      },
    },
  },
  {
    id: "3",
    name: "EOG Dataset 1",
    source: "OpenNeuro",
    description: "EOG data for eye movement analysis.",
    dataType: "EOG",
    metadata: {
      samplingRate: 250,
      channels: 2,
      duration: 1200,
      permissions: {
        isPublic: true,
      },
    },
  },
];

// GET /api/datasets endpoint
router.get("/", (req, res) => {
  res.status(200).json(mockDatasets);
});

// POST /api/datasets endpoint
router.post("/", (req, res) => {
  const { datasetId, origin, license } = req.body;

  if (!datasetId || !origin || !license) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  // In a real implementation, you would save this to a database
  res.status(201).json({
    success: true,
    message: "Dataset uploaded successfully",
  });
});

// If you need to support other methods:
router.all("/", (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
});

module.exports = router;
