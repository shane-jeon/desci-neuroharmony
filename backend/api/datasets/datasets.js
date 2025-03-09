const express = require("express");
const router = express.Router();

// Mock dataset data
const mockDatasets = [
  {
    id: "1",
    name: "EEG Dataset 1",
    source: "OpenNeuro",
    description: "Sample EEG dataset from OpenNeuro.",
  },
  {
    id: "2",
    name: "Neuroscience Study",
    source: "IEEG Portal",
    description: "Neuroscience research data from IEEG Portal.",
  },
];

// GET /api/datasets endpoint
router.get("/", (req, res) => {
  res.status(200).json(mockDatasets);
});

// If you need to support other methods:
router.all("/", (req, res) => {
  res.status(405).json({ message: "Method Not Allowed" });
});

module.exports = router;
