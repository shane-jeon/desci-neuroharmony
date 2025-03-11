# NeuroHarmony Backend

This directory contains the backend services for the NeuroHarmony platform, including smart contracts and Python services.

## 📁 Structure

```
backend/
├── contracts/           # Solidity smart contracts
├── python/             # Python backend services
│   ├── app.py         # Flask server
│   ├── requirements.txt
│   └── *.py           # Service modules
├── scripts/            # Deployment scripts
└── config/            # Contract configurations
```

## 🔧 Setup

### Prerequisites

- Node.js v16+
- Python 3.8+
- Hardhat
- Web3.py

### Smart Contracts

1. Install dependencies:

```bash
npm install
```

2. Start local blockchain:

```bash
npx hardhat node
```

3. Deploy contracts:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Python Backend

1. Create virtual environment:

```bash
cd python
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start server:

```bash
python app.py
```

## 🔌 API Endpoints

### Data Processing

- `POST /api/python/visualize`: Visualize EEG data
- `POST /api/python/analyze`: Frequency analysis
- `POST /api/python/export`: Export data
- `GET /api/python/fetch-data`: Fetch OpenNeuro data

### Blockchain Integration

- `POST /api/python/project`: Create research project
- `POST /api/python/grant`: Create grant proposal
- `POST /api/python/reward`: Distribute rewards
- `POST /api/python/stake`: Stake tokens
- `POST /api/python/unstake`: Unstake tokens
- `POST /api/python/mint`: Mint tokens (dev only)

## 🔐 Security

- Input validation on all endpoints
- Rate limiting
- Data size restrictions
- Secure transaction handling
- Error logging
- Access control

## 📝 Smart Contracts

### ResearchCollaboration.sol

- Project creation and management
- Collaboration tracking
- Access control

### NeuroGrantDAO.sol

- Proposal creation and voting
- Grant distribution
- Governance mechanisms

### NEUROToken.sol

- ERC-20 implementation
- Staking functionality
- Reward distribution

### NeuroDataProvenance.sol

- Data tracking
- Provenance verification

## 🐍 Python Services

### Token Management

- Web3.py integration
- Transaction handling
- Balance checking
- Staking operations

### Data Processing

- EEG data visualization
- Frequency analysis
- Data export
- Size optimization

### Research Integration

- ResearchHub connection
- Project management
- Grant handling

## 🔍 Logging

Logs are stored in the standard output and can be redirected as needed. The logging format includes:

- Timestamp
- Log level
- Module name
- Message

## 🚀 Development

1. Make sure contracts are deployed
2. Update contract addresses in `config/contracts.config.json`
3. Start Python server
4. Test endpoints with provided Postman collection

## 📚 Documentation

- Smart contract documentation in `contracts/docs/`
- API documentation in OpenAPI format
- Python module docstrings

## ⚠️ Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "errorType": "ERROR_TYPE"
}
```

## 🧪 Testing

### Smart Contracts

```bash
npx hardhat test
```

### Python Backend

```bash
python -m pytest tests/
```

## 🔄 Recent Updates

- Integrated Web3.py with smart contracts
- Added token staking functionality
- Implemented proper error handling
- Added development environment tools
- Enhanced API documentation
- Optimized data processing

## 📋 Requirements

See `requirements.txt` for Python dependencies and `package.json` for Node.js dependencies.
