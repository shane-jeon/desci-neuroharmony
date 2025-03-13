# DeSci NeuroHarmony

A decentralized platform for neuroscience research collaboration and funding.

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Python (Flask), Node.js
- **Blockchain**: Solidity, Hardhat, Web3.js
- **Smart Contracts**: ERC-20
- **Development Tools**: MetaMask, Hardhat Network

## Collaborators

- [Shane J.](https://github.com/shane-jeon) - Full Stack Engineer
- [Raghavendra](https://github.com/drraghavendra) - Blockchain Engineer
- [Catherine](https://github.com/dr-cath) - Project Manager

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
│   ├── contracts/   # Solidity smart contracts
│   ├── scripts/     # Deployment and utility scripts
│   ├── config/      # Configuration files
│   ├── python/      # Python backend server
│   └── test/        # Contract test files
├── frontend/         # Next.js frontend application
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   ├── lib/         # Utility functions and Web3 setup
│   ├── styles/      # CSS and styling files
│   └── public/      # Static assets
└── README.md        # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shane-jeon/desci-neuroharmony.git
cd desci-neuroharmony
```

### 2. Backend Setup

```bash
cd backend

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

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

When you run `npx hardhat node`, you'll get a list of accounts and their private keys. The deployment script will automatically update the contract addresses in `backend/config/contracts.config.json`. Here's an example of how the addresses will look:

```
NEUROToken: 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
NeuroGrantDAO: 0x0165878A594ca255338adfa4d48449f69242Eb8F
NeuroDataProvenance: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
ResearchCollaboration: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
ResearchFunding: 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
ScienceToken: 0x610178dA211FEF7D417bC0e6FeD39F05609AD788
```

## Development Accounts

When you run `npx hardhat node`, you'll get a list of pre-funded accounts and their private keys. The first account (index 0) will be used as the default deployer. You can import these accounts into MetaMask using their private keys.

Example output from `npx hardhat node`:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f97a9a1845b3523e741996cf26f71b96771
```

## Available Features

- **NEURO Token Staking and Rewards**

  - Stake NEURO tokens to earn rewards
  - Rewards are distributed based on staking duration and amount
  - Staked tokens provide voting power in the DAO

- **Research Project Collaboration**

  - Create and manage research projects
  - Invite collaborators and manage permissions
  - Track contributions and progress

- **Grant Proposals and Voting**

  - Create grant proposals with detailed descriptions and budgets
  - Vote on proposals using staked NEURO tokens
  - Execute approved proposals automatically

- **Dataset Provenance Tracking**

  - Upload and track neuroscience datasets
  - Record data origin, license, and usage history
  - Ensure data integrity and transparency

- **Research Funding Distribution**
  - Automated distribution of grant funds
  - Milestone-based payment system
  - Transparent fund allocation tracking

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
