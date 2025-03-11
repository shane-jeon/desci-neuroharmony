# DeSci NeuroHarmony

A decentralized platform for neuroscience research collaboration and funding.

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn
- A modern web browser
- MetaMask wallet extension

## Project Structure

```
desci-neuroharmony/
├── backend/          # Smart contracts and Python backend
├── frontend/         # Next.js frontend application
└── README.md        # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd desci-neuroharmony
```

### 2. Backend Setup

```bash
cd backend

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Start local Hardhat node
npx hardhat node

# In a new terminal, deploy smart contracts
npx hardhat run scripts/deploy.js --network localhost

# Start Python backend server
python3 python/app.py
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. MetaMask Configuration

1. Install MetaMask browser extension
2. Add Hardhat Network to MetaMask:
   - Network Name: Hardhat
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

### 5. Get Test NEURO Tokens

To get test NEURO tokens for development:

```bash
cd backend
npx hardhat run scripts/mint.js --network localhost
```

This will mint 1000 NEURO tokens to your connected wallet address.

## Smart Contract Addresses (Local Development)

- NEUROToken: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
- NeuroGrantDAO: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
- NeuroDataProvenance: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- ResearchCollaboration: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
- ResearchFunding: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
- ScienceToken: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707

## Development Accounts

When running the local Hardhat network, you can use these pre-funded accounts for testing:

- Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (default deployer)
  - Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

## Available Features

- NEURO token staking and rewards
- Research project collaboration
- Grant proposals and voting
- Dataset provenance tracking
- Research funding distribution

## Common Issues & Troubleshooting

1. If you get "nonce too high" error in MetaMask:

   - Go to MetaMask Settings > Advanced > Reset Account

2. If contracts are not found:

   - Make sure you've deployed contracts using `npx hardhat run scripts/deploy.js --network localhost`
   - Verify contract addresses in `backend/config/contracts.config.json`

3. If Python backend fails to start:
   - Check if all required Python packages are installed
   - Verify the Hardhat node is running
   - Ensure the contract addresses in config match the deployed addresses

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
