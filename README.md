# DeSci NeuroHarmony

> Built for DeSci Mania Hackathon 2025 - AuraSci Bounty Track
>

A decentralized platform for collaborative neuroscience research, focusing on EEG and EOG data analysis.

## Collaborators

- [Raghavendra](https://github.com/drraghavendra) - Blockchain Engineer
- [Shane](https://github.com/shane-jeon/) - Fullstack Engineer
- [Catherine](https://github.com/dr-cath) - Product Manager

## Project Structure

```
desci-neuroharmony/
├── backend/           # Python Flask backend
│   ├── datasets/     # EEG and EOG datasets
│   └── services/     # Backend services
├── frontend/         # Next.js frontend
└── contracts/        # Smart contracts
```

## Data Sources

- EEG Dataset: OpenNeuro Dataset [ds004504](https://github.com/OpenNeuroDatasets/ds004504)
- EOG Dataset: University of Tübingen, Tübingen, Germany [Dataset Link](https://doi.gin.g-node.org/10.12751/g-node.ng4dfr/)

## Neo Integration

NeuroHarmony leverages Neo, a powerful Python library designed specifically for handling neurophysiological data. This integration provides several key advantages:

### Data Standardization

- Support for multiple file formats including Neuralynx, Plexon, Blackrock, and more
- Unified data structures for different types of neural data
- Seamless integration of data from various recording devices and sources

### Interoperability

- Native compatibility with OpenNeuro datasets
- Easy integration with other neurodata repositories
- Standardized data exchange between different analysis tools

### Advanced Features

- Comprehensive data representation (spike trains, events, epochs)
- Built-in unit handling and conversion
- Efficient memory management for large datasets

The Neo integration is central to our vision of creating a collaborative platform that can handle diverse neurophysiological data formats while maintaining data integrity and accessibility.

## Setup Instructions

### Prerequisites

1. Install Node.js (v18 or higher) from [nodejs.org](https://nodejs.org/)
2. Install Python (v3.8 or higher) from [python.org](https://python.org)
3. Install Git from [git-scm.com](https://git-scm.com/)
4. Install MetaMask browser extension from [metamask.io](https://metamask.io/)

### MetaMask Configuration

1. Install MetaMask browser extension
2. Create a new wallet:

   - Click "Create a new wallet"
   - Follow the security steps to create your password and save your recovery phrase
   - **IMPORTANT**: Never share your recovery phrase or private keys with anyone
   - Store your recovery phrase securely offline

3. For Development Network:

   - Open MetaMask
   - Click the network dropdown (usually says "Ethereum Mainnet")
   - Select "Add Network"
   - Add Hardhat Network:
     ```
     Network Name: Hardhat Local
     RPC URL: http://127.0.0.1:8545
     Chain ID: 31337
     Currency Symbol: ETH
     ```

4. For testing purposes:
   - Use Hardhat's built-in test accounts
   - **NEVER** use real private keys or recovery phrases
   - Test ETH can be obtained from faucets for development networks

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/desci-neuroharmony.git
cd desci-neuroharmony
```

2. Create and activate a virtual environment:

```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:

```bash
cd backend/services/python
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env file with your configuration
```

5. Dataset Management:

```bash
# Install datalad if not already installed
pip install datalad

# Get the datasets
cd backend/datasets

# For EEG dataset
datalad install https://github.com/OpenNeuroDatasets/ds004504.git
datalad get ds004504/*/*/eeg/*.set

# For EOG dataset
# Follow instructions at https://doi.gin.g-node.org/10.12751/g-node.ng4dfr/
```

6. Start the Flask server:

```bash
cd backend/services/python
python app.py
```

The server will run on http://localhost:5001

### Frontend Setup

1. Install Node.js dependencies:

```bash
cd frontend
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Run the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### Smart Contract Setup

1. Install Hardhat dependencies:

```bash
cd contracts
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

## Features

- EEG Data Visualization

  - Interactive time series plots using Chart.js
  - Multiple channel visualization with Neo-powered data processing
  - Advanced signal analysis and filtering capabilities
  - Comprehensive metadata handling through Neo's object model
  - Real-time data conversion and standardization

- EOG Data Analysis
  - BrainVision format support via Neo's I/O modules
  - Session-based data management with standardized data structures
  - Advanced signal processing leveraging Neo's analysis tools
  - Automated artifact detection and removal

## Dependencies

### Backend

- Flask
- Flask-CORS
- NumPy
- Neo
- MNE
- DataLad (for dataset management)
- Web3.py

### Frontend

- Next.js
- React
- Chart.js
- react-chartjs-2
- TailwindCSS

## Development

- Backend API runs on port 5001
- Frontend development server runs on port 3000
- Data visualization uses Chart.js for interactive plotting
- Dataset management uses DataLad/git-annex for large files

## License

This project is licensed under the MIT License - see the LICENSE file for details.
