import type { NextApiRequest, NextApiResponse } from "next";

interface Dataset {
  id: string;
  name: string;
  source: string;
  description: string;
}

const mockDatasets: Dataset[] = [
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(mockDatasets);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
