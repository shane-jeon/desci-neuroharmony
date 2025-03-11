# NeuroHarmony Frontend

## Overview

The NeuroHarmony frontend is built with Next.js 13 and provides a modern, responsive interface for interacting with the NeuroHarmony platform. It features real-time data visualization, blockchain integration, and a comprehensive research collaboration system.

## 🎨 Components

### DataVisualizer (`components/DataVisualizer.tsx`)

Handles EEG data visualization and analysis:

- Real-time signal plotting
- Frequency analysis with band detection
- Data export functionality
- Interactive visualization controls

```typescript
interface Dataset {
  id: string;
  name: string;
  dataType: "ECG" | "EEG" | "EOG";
  data?: {
    times?: number[];
    signals?: number[][];
  };
  metadata: {
    samplingRate?: number;
    channels?: number;
    duration?: number;
  };
}
```

### TokenRewards (`components/TokenRewards.tsx`)

Manages token-related operations:

- Token staking and unstaking
- Reward distribution
- Transaction history
- Balance display

### ResearchCollaboration (`components/ResearchCollaboration.tsx`)

Handles research project management:

- Project creation and editing
- Team collaboration
- Resource sharing
- Progress tracking

### DAOGovernance (`components/DAOGovernance.tsx`)

Manages DAO operations:

- Proposal creation
- Voting system
- Fund allocation
- Governance tracking

### NeuroharmonyFrontend (`components/NeuroharmonyFrontend.tsx`)

Main application interface:

- Navigation
- Data management
- User authentication
- System status

## 🔌 Backend Integration

### Data Processing Endpoints

```typescript
// Visualize EEG data
const visualizeData = async (dataset: Dataset) => {
  const response = await fetch("http://localhost:5000/api/python/visualize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataType: dataset.dataType,
      data: dataset.data,
      metadata: dataset.metadata,
    }),
  });
  return response.json();
};

// Perform frequency analysis
const analyzeData = async (dataset: Dataset) => {
  const response = await fetch("http://localhost:5000/api/python/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataType: dataset.dataType,
      data: dataset.data,
      metadata: dataset.metadata,
    }),
  });
  return response.json();
};

// Export data
const exportData = async (dataset: Dataset) => {
  const response = await fetch("http://localhost:5000/api/python/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataType: dataset.dataType,
      data: dataset.data,
      metadata: dataset.metadata,
    }),
  });
  return response.json();
};
```

### Blockchain Integration

The frontend interacts with smart contracts using Web3.js:

- Wallet connection
- Transaction signing
- Contract interactions
- Event listening

## 🚀 Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure:

```
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_CHAIN_ID=your_chain_id
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

3. Start development server:

```bash
npm run dev
# or
yarn dev
```

## 📦 Dependencies

- Next.js 13: React framework
- Web3.js: Ethereum interaction
- TailwindCSS: Styling
- React: UI components
- TypeScript: Type safety

## 🎨 Styling

The application uses TailwindCSS for styling with:

- Responsive design
- Dark mode support
- Custom components
- Consistent theming

## 🔒 Security

- Input validation
- Error handling
- Secure API calls
- Protected routes
- Wallet security

## 🧪 Testing

Run tests:

```bash
npm test
# or
yarn test
```

## 📱 Responsive Design

The UI is optimized for:

- Desktop
- Tablet
- Mobile
- Different screen sizes

## 🔍 State Management

- React hooks
- Context API
- Local storage
- Session management

## 🌐 Network Handling

- Loading states
- Error handling
- Retry mechanisms
- Offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a pull request
