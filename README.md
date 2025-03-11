# NeuroHarmony: Decentralized Research Collaboration Platform

## 🧠 Overview

NeuroHarmony is a decentralized platform that revolutionizes neuroscience research collaboration through blockchain technology. It enables researchers to collaborate, share resources, and govern research funding through a transparent and efficient DAO structure.

## ✨ Key Features

### 📊 Data Analysis & Visualization

- EEG data visualization with interactive plots
- Frequency analysis with band detection (delta, theta, alpha, beta, gamma)
- Data export functionality in JSON format
- Real-time data processing and visualization

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

### Backend (Python)

- Flask server for data processing and API endpoints
- Scientific computing with NumPy and SciPy
- Data visualization using Matplotlib
- Real-time data analysis capabilities

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
- Python 3.8 or higher
- npm or yarn
- MetaMask wallet
- Hardhat or local blockchain network

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
NEXT_PUBLIC_RPC_URL=your_rpc_url
NEXT_PUBLIC_CHAIN_ID=your_chain_id
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

5. Start the Python backend server

```bash
cd backend/python
python app.py
```

6. Start the frontend development server

```bash
cd frontend
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 API Endpoints

### Data Processing

- `POST /api/python/visualize`: Visualize EEG data
- `POST /api/python/analyze`: Perform frequency analysis
- `POST /api/python/export`: Export data in JSON format

### Research Collaboration

- `POST /api/python/project`: Create new research project
- `POST /api/python/research-hub`: Integrate with ResearchHub

### Token Management

- `POST /api/python/reward`: Distribute token rewards
- `POST /api/python/stake`: Stake NEURO tokens
- `POST /api/python/unstake`: Unstake NEURO tokens

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
│   └── contracts/        # Smart contracts
└── scripts/              # Deployment scripts
```

## 🔐 Security

- Smart contracts are designed with security best practices
- Access control mechanisms for sensitive operations
- Input validation and error handling
- Gas optimization
- Rate limiting on API endpoints
- Data size restrictions for performance

## 🛣️ Roadmap

- [x] EEG data visualization and analysis
- [x] Token rewards system
- [x] Research collaboration platform
- [ ] Integration with IPFS for decentralized storage
- [ ] Enhanced governance mechanisms
- [ ] Mobile application development
- [ ] Cross-chain compatibility
- [ ] AI-powered research matching

## 👥 Team

- Shane J. - Full Stack Developer
- Raghavendra - Blockchain Developer
- Catherine - Product Manager

---

Built with ❤️ for the advancement of neuroscience research
