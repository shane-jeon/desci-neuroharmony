# NeuroHarmony: Decentralized Research Collaboration Platform

## 🧠 Overview

NeuroHarmony is a decentralized platform that revolutionizes neuroscience research collaboration through blockchain technology. It enables researchers to collaborate, share resources, and govern research funding through a transparent and efficient DAO structure.

## ✨ Key Features

### 📊 Data Analysis & Visualization

- EEG data visualization with interactive plots
- Frequency analysis with band detection (delta, theta, alpha, beta, gamma)
- Data export functionality in JSON format
- Real-time data processing and visualization
- Performance optimized with data size limits

### 🤝 Research Collaboration

- Create and manage research projects through smart contracts
- Track project progress and completion status
- Secure data provenance tracking
- Integration with ResearchHub for wider collaboration

### 🏛️ DAO Governance

- Create and vote on funding proposals
- Execute approved proposals automatically
- Transparent budget allocation
- Token-based governance rights

### 🎁 Token Rewards

- NEURO token rewards for research contributions
- Stake tokens for governance participation
- Flexible staking/unstaking mechanisms
- Development environment token minting
- Comprehensive error handling and validation

## 🏗️ Architecture

### Backend (Python)

- Flask server with RESTful API endpoints
- Web3.py for Ethereum blockchain interaction
- Comprehensive error handling and logging
- Rate limiting and data size restrictions
- Modular architecture for easy extension

### Smart Contracts

- `ResearchCollaboration.sol`: Research project management
- `NeuroGrantDAO.sol`: Governance and proposal system
- `NEUROToken.sol`: ERC-20 token with staking functionality
- `NeuroDataProvenance.sol`: Data provenance tracking

### Frontend

- Next.js 13 with App Router
- React for UI components
- Web3.js for blockchain interaction
- TailwindCSS for styling
- MetaMask integration

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- npm or yarn
- MetaMask wallet browser extension
- Hardhat for local blockchain

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/neuro-harmony.git
cd neuro-harmony
```

2. Install frontend dependencies

```bash
cd frontend
npm install
# or
yarn install
```

3. Install Python backend dependencies

```bash
cd backend/python
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

4. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

5. Start the local blockchain

```bash
cd backend
npx hardhat node
```

6. Deploy smart contracts

```bash
npx hardhat run scripts/deploy.js --network localhost
```

7. Configure MetaMask for Local Development

To test the application without using real ETH, you need to connect MetaMask to the local Hardhat network:

a. Install the MetaMask browser extension if you haven't already
b. Sign in to your MetaMask wallet
c. Add the Hardhat local network:

- Open MetaMask
- Go to Settings > Networks > Add a Network
- Fill in the network details:
  - Network Name: Hardhat Localhost
  - RPC URL: http://127.0.0.1:8545
  - Chain ID: 31337
  - Currency Symbol: ETH

Note: The Hardhat node provides 20 test accounts with 10000 ETH each. You can import these accounts using their private keys shown in the Hardhat node console.

8. Start the Python backend server

```bash
cd backend/python
python app.py
```

9. Start the frontend development server

```bash
cd frontend
npm run dev
# or
yarn dev
```

10. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 API Endpoints

### Data Processing

- `POST /api/python/visualize`: Visualize EEG data
- `POST /api/python/analyze`: Perform frequency analysis
- `POST /api/python/export`: Export data in JSON format
- `GET /api/python/fetch-data`: Fetch OpenNeuro datasets

### Research Collaboration

- `POST /api/python/project`: Create research project
- `POST /api/python/research-hub`: Post to ResearchHub

### Token Management

- `POST /api/python/reward`: Distribute token rewards
- `POST /api/python/stake`: Stake NEURO tokens
- `POST /api/python/unstake`: Unstake NEURO tokens
- `POST /api/python/mint`: Mint tokens (development only)

### Funding

- `POST /api/python/grant`: Create grant proposals

## 🎨 Project Structure

```
neuro-harmony/
├── frontend/                # Next.js frontend
│   ├── app/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utility functions and Web3 setup
│   │   └── page.tsx       # Main page component
│   └── public/            # Static assets
├── backend/
│   ├── python/            # Python backend
│   │   ├── app.py        # Flask server
│   │   └── *.py          # Backend modules
│   ├── contracts/        # Smart contracts
│   └── scripts/          # Deployment scripts
└── README.md             # Documentation
```

## 🔐 Security Features

- Comprehensive input validation
- Rate limiting on API endpoints
- Data size restrictions
- Secure transaction handling
- Error logging and monitoring
- Access control for sensitive operations

## 🛣️ Recent Updates

- Integrated Python backend with smart contracts
- Added token staking/unstaking functionality
- Implemented proper error handling and logging
- Optimized data processing performance
- Added development environment tooling
- Enhanced API documentation

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the advancement of neuroscience research
