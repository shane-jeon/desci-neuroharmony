# NeuroHarmony: Decentralized Research Collaboration Platform

![NeuroHarmony Banner](public/banner.png)

## 🧠 Overview

NeuroHarmony is a decentralized platform that revolutionizes neuroscience research collaboration through blockchain technology. It enables researchers to collaborate, share resources, and govern research funding through a transparent and efficient DAO structure.

## ✨ Key Features

### 🤝 Research Collaboration

- Create and manage research projects
- Add contributors to projects
- Share research documents securely through IPFS
- Track project progress and completion status

### 🏛️ DAO Governance

- Create funding proposals
- Vote on research proposals
- Execute approved proposals
- Transparent budget allocation

### 🎁 Token Rewards

- Earn NEURO tokens for contributions
- Stake tokens for governance rights
- Track reward history
- Incentivized participation

## 🏗️ Architecture

### Smart Contracts

- `ResearchCollaboration.sol`: Manages research projects and collaboration
- `NeuroGrantDAO.sol`: Handles governance and proposal management
- `NeuroToken.sol`: ERC-20 token for rewards and governance

### Frontend

- Next.js 13 with App Router
- React for UI components
- Web3.js for blockchain interaction
- TailwindCSS for styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Hardhat or local blockchain network

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/neuro-harmony.git
cd neuro-harmony
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_CHAIN_ID=your_chain_id
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Smart Contract Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy Contracts

```bash
npx hardhat run scripts/deploy.js --network <network_name>
```

## 🎨 Project Structure

```
neuro-harmony/
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── lib/               # Utility functions and Web3 setup
│   └── page.tsx           # Main page component
├── contracts/             # Smart contracts
├── public/               # Static assets
├── styles/              # Global styles
├── test/                # Contract tests
└── scripts/             # Deployment scripts
```

## 🔐 Security

- Smart contracts are designed with security best practices
- Access control mechanisms for sensitive operations
- Input validation and error handling
- Gas optimization

## 🛣️ Roadmap

- [ ] Integration with IPFS for decentralized storage
- [ ] Enhanced governance mechanisms
- [ ] Mobile application development
- [ ] Cross-chain compatibility
- [ ] AI-powered research matching

### Problem Statement

NeuroHarmony addresses the challenges in neuroscience research collaboration:

- Fragmented research efforts
- Limited funding transparency
- Inefficient resource sharing
- Lack of incentivization

### Solution

Our platform provides:

- Decentralized collaboration tools
- Transparent funding allocation
- Token-based incentives
- Secure document sharing

### Impact

- Accelerates neuroscience research
- Promotes open science
- Democratizes research funding
- Builds global research communities

## 👥 Team

- Shane J. - Full Stack Developer
- Raghavendra - Blockchain Developer
- Catherine - Product Manager

---

Built with ❤️ for the advancement of neuroscience research
