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
3. Reset your account in MetaMask if you've used it before:
   - Settings > Advanced > Reset Account

### 5. Get Test NEURO Tokens

To get test NEURO tokens for development:

```bash
cd backend
npx hardhat run scripts/mint.js --network localhost
```

This will mint 10,000 NEURO tokens to your connected wallet address.

## Smart Contract Addresses (Local Development)

After deploying the contracts, you'll have these addresses (note that these will change each time you redeploy):

- NEUROToken: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
- NeuroGrantDAO: 0x0165878A594ca255338adfa4d48449f69242Eb8F
- NeuroDataProvenance: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
- ResearchCollaboration: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
- ResearchFunding: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
- ScienceToken: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788

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
   - Check that you're connected to the correct network in MetaMask

3. If Python backend fails to start:

   - Check if all required Python packages are installed
   - Verify the Hardhat node is running
   - Ensure the contract addresses in config match the deployed addresses

4. If transactions fail:
   - Make sure you have enough ETH for gas fees
   - Verify you're using the correct account in MetaMask
   - Check that contract addresses are correct

## License

This project is licensed under the MIT License - see the LICENSE file for details.
