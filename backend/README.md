# NeuroHarmony Backend

## Overview

The NeuroHarmony backend consists of smart contracts, a Node.js/Express server, and a Python/Flask server. It handles blockchain interactions, data processing, and API endpoints for the NeuroHarmony platform.

## Project Structure

```
backend/
├── contracts/           # Solidity smart contracts
│   ├── NEUROToken.sol
│   ├── NeuroGrantDAO.sol
│   └── interfaces/     # Contract interfaces
├── scripts/            # Deployment and utility scripts
│   ├── deploy.js
│   └── mint.js
├── config/             # Configuration files
│   └── contracts.config.json
├── python/             # Python backend server
│   ├── app.py
│   └── requirements.txt
└── test/               # Contract test files
```

## Smart Contracts

### NEUROToken

- ERC-20 token implementation
- Staking functionality
- Reward distribution
- Voting power calculation

### NeuroGrantDAO

- Proposal creation and management
- Voting system with fixed amount (0.1 NEURO)
- Proposal execution
- Voting power tracking

## Setup Instructions

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r python/requirements.txt
```

### 2. Start Local Blockchain

```bash
# Start Hardhat network
npx hardhat node
```

Keep this terminal running.

### 3. Deploy Contracts

```bash
# In a new terminal
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Start Backend Servers

1. Start Express server:

```bash
npm run dev
```

2. Start Python server:

```bash
cd python
python3 app.py
```

## Contract Addresses

After deployment, contract addresses will be automatically updated in `config/contracts.config.json`:

```json
{
  "NEUROToken": "0x...",
  "NeuroGrantDAO": "0x..."
}
```

## API Endpoints

### Express Server (Port 5000)

- `POST /api/proposals` - Create new proposal
- `GET /api/proposals` - Get all proposals
- `POST /api/vote` - Cast vote on proposal
- `GET /api/voting-power` - Get user's voting power

### Python Server (Port 5001)

- `POST /api/analyze` - Analyze research data
- `GET /api/collaborations` - Get research collaborations
- `POST /api/collaborations` - Create new collaboration

## Testing

### Smart Contract Tests

```bash
npx hardhat test
```

### API Tests

```bash
# Express server tests
npm test

# Python server tests
cd python
python3 -m pytest
```

## Development

### Adding New Contracts

1. Create contract in `contracts/`
2. Add deployment script in `scripts/`
3. Update `contracts.config.json`
4. Write tests in `test/`

### Adding New API Endpoints

1. Express Server:

   - Add route in `routes/`
   - Add controller in `controllers/`
   - Add tests in `test/`

2. Python Server:
   - Add route in `python/app.py`
   - Add handler in `python/handlers/`
   - Add tests in `python/test/`

## Troubleshooting

1. **Contract Deployment Issues**

   - Check Hardhat node is running
   - Verify contract addresses in config
   - Check for compilation errors

2. **Server Connection Issues**

   - Verify ports 5000 and 5001 are available
   - Check server logs for errors
   - Ensure all dependencies are installed

3. **API Errors**
   - Check request format
   - Verify contract interactions
   - Check server logs

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## License

MIT License - See LICENSE file for details
