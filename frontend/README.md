# NeuroHarmony Frontend

## Overview

The NeuroHarmony frontend is built with Next.js 14 and provides a modern, responsive interface for interacting with the NeuroHarmony platform. It features real-time blockchain integration, token management, and a comprehensive research collaboration system.

## Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   ├── features/          # Feature-specific components
│   │   │   ├── DAOGovernance.tsx
│   │   │   ├── TokenRewards.tsx
│   │   │   └── ResearchCollaboration.tsx
│   │   └── shared/           # Shared components
│   │       ├── Modal.tsx
│   │       └── Layout.tsx
│   ├── contexts/             # React contexts
│   │   └── VotingPowerContext.tsx
│   └── lib/                  # Utility functions and Web3 setup
│       └── web3.ts
├── public/                   # Static assets
└── styles/                   # Global styles
```

## Key Features

### Token Management

- NEURO token staking and unstaking
- Real-time balance tracking
- Transaction history
- Reward distribution

### DAO Governance

- Proposal creation and voting
- Fixed voting amount (0.1 NEURO)
- Real-time voting power tracking
- Proposal execution

### Research Collaboration

- Project management
- Resource sharing
- Progress tracking
- Team collaboration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Access the application at `http://localhost:3000`

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Dependencies

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Web3.js
- React Query
- React Context

## Development

### Component Structure

- Feature components are in `app/components/features/`
- Shared components are in `app/components/shared/`
- Context providers are in `app/contexts/`

### State Management

- React Context for global state (e.g., voting power)
- Local state for component-specific data
- React Query for server state management

### Styling

- TailwindCSS for utility-first styling
- Responsive design for all screen sizes
- Dark mode support

## Testing

```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - See LICENSE file for details
