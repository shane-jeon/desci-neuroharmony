# DeSci NeuroHarmony

A decentralized platform for neuroscience research collaboration and funding.

## Tech Stack

- **Frontend**:

  - Next.js 14
  - React 18
  - TypeScript
  - TailwindCSS
  - Web3.js
  - React Query
  - React Context (for state management)

- **Backend**:

  - Node.js/Express.js
  - Python 3.8+
  - Flask
  - SQLAlchemy
  - Web3.py

- **Blockchain**:
  - Solidity
  - Hardhat
  - Web3.js
  - OpenZeppelin Contracts

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8 or higher
- npm or yarn
- MetaMask wallet extension
- Git

## Project Structure

```
desci-neuroharmony/
├── backend/          # Smart contracts and Python backend
│   ├── contracts/   # Solidity smart contracts
│   ├── scripts/     # Deployment and utility scripts
│   ├── config/      # Configuration files
│   ├── python/      # Python backend server
│   └── test/        # Contract test files
├── frontend/         # Next.js frontend application
│   ├── app/         # Next.js app directory
│   │   ├── components/  # React components
│   │   │   ├── features/  # Feature-specific components
│   │   │   └── shared/    # Shared components
│   │   ├── contexts/     # React contexts
│   │   └── lib/          # Utility functions and Web3 setup
│   ├── public/      # Static assets
│   └── styles/      # Global styles
└── README.md        # This file
```

## Installation Guide

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/shane-jeon/desci-neuroharmony.git
cd desci-neuroharmony

# Install dependencies for both frontend and backend
npm install
cd backend
npm install
cd ../frontend
npm install
```

### 2. Backend Setup

1. Start the local Hardhat network:

```bash
cd backend
npx hardhat node
```

Keep this terminal running.

2. Create a `.env.local` file in the backend directory:

```bash
# In backend directory
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
NEXT_PUBLIC_PRIVATE_KEY=<YOUR_PRIVATE_KEY>

# Contract addresses
NEXT_PUBLIC_RESEARCH_COLLABORATION_ADDRESS=<YOUR_RESEARCH_COLLABORATION_ADDRESS>
NEXT_PUBLIC_NEURO_DATA_PROVENANCE_ADDRESS=<YOUR_NEURO_DATA_PROVENANCE_ADDRESS>
NEXT_PUBLIC_NEURO_GRANT_DAO_ADDRESS=<YOUR_NEURO_GRANT_DAO_ADDRESS>
NEXT_PUBLIC_NEURO_TOKEN_ADDRESS=<YOUR_NEURO_TOKEN_ADDRESS>
NEXT_PUBLIC_RESEARCH_FUNDING_ADDRESS=<YOUR_RESEARCH_FUNDING_ADDRESS>
NEXT_PUBLIC_SCIENCE_TOKEN_ADDRESS=<YOUR_SCIENCE_TOKEN_ADDRESS>
```

3. Deploy smart contracts:

```bash
# In a new terminal
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

4. Start the Express server:

```bash
# In a new terminal
cd backend
npm start
```

5. Start the Python backend:

```bash
# In a new terminal
cd backend/services/python
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python3 app.py
```

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend
npm run dev
```

### 4. MetaMask Configuration

1. Install MetaMask browser extension
2. Add Hardhat Network:
   - Network Name: Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
3. Import test account:
   - Go to MetaMask > Import Account
   - Use this private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH for testing

### 5. Get Test NEURO Tokens

```bash
cd backend
npx hardhat run scripts/mint.js --network localhost
```

## Available Features

- **NEURO Token Staking and Rewards**

  - Stake NEURO tokens to earn rewards
  - Track staking history and rewards
  - Unstake tokens with cooldown period

- **DAO Governance**

  - Create and vote on proposals
  - Fixed voting amount (0.1 NEURO per vote)
  - Real-time voting power tracking

- **Research Collaboration**
  - Create and manage research projects
  - Track contributions and progress
  - Share resources and findings

## Troubleshooting

1. **MetaMask Connection Issues**

   - Reset account: MetaMask Settings > Advanced > Reset Account
   - Ensure you're on the Hardhat network
   - Check if the contract addresses match in `frontend/app/lib/web3.ts`

2. **Contract Deployment Issues**

   - Verify Hardhat node is running
   - Check contract addresses in `backend/config/contracts.config.json`
   - Ensure you have enough ETH in your test account

3. **Backend Connection Issues**

   - Verify all servers are running
   - Check console for specific error messages
   - Ensure ports 3000 (frontend), 5000 (Express), and 5001 (Flask) are available

4. **Transaction Failures**
   - Check MetaMask for transaction errors
   - Verify you have enough ETH for gas
   - Ensure you're connected to the correct network

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

MIT License - See LICENSE file for details
