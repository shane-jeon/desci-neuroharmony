# NeuroHarmony Backend

## Overview

The NeuroHarmony backend consists of a Flask server that handles data processing, analysis, and blockchain interactions. It provides RESTful APIs for the frontend to interact with various services.

## 🔧 Components

### Data Processing and Visualization (`DataParsing_and_Visualization.py`)

Handles EEG data processing and visualization with the following features:

- Real-time EEG signal visualization
- Frequency analysis with band detection
- Data export functionality
- Mock data generation for testing

### Token Rewards System (`Token_Rewards_system_for_Open_Science_Contributions_Backend.py`)

Manages the token reward system:

- Token distribution for contributions
- Staking mechanism
- Reward calculation
- Transaction handling

### Research Collaboration (`Decentralized_Collaboration_Platform_for_Researchers_Backend.py`)

Handles research project management:

- Project creation and updates
- Collaboration tracking
- Resource sharing
- Progress monitoring

### Grant Allocation (`Transparent_Funding_and_Grant_Allocation_Platform_Backend.py`)

Manages research funding:

- Grant proposal creation
- Fund allocation
- Progress tracking
- Reporting

### Data Fetching (`Fetching_Data.py`)

Handles data acquisition:

- OpenNeuro dataset fetching
- IEEG Portal integration
- G-Node data access
- Data format standardization

## 📡 API Endpoints

### Data Processing

#### `POST /api/python/visualize`

Visualizes EEG data.

```json
{
  "dataType": "EEG",
  "data": {
    "times": number[],
    "signals": number[][]
  },
  "metadata": {
    "samplingRate": number,
    "channels": number,
    "duration": number
  }
}
```

#### `POST /api/python/analyze`

Performs frequency analysis.

```json
{
  "dataType": "EEG",
  "data": {
    "times": number[],
    "signals": number[][]
  },
  "metadata": {
    "samplingRate": number,
    "channels": number,
    "duration": number
  }
}
```

#### `POST /api/python/export`

Exports data in JSON format.

```json
{
  "dataType": "EEG",
  "data": {
    "times": number[],
    "signals": number[][]
  },
  "metadata": {
    "samplingRate": number,
    "channels": number,
    "duration": number
  }
}
```

### Token Management

#### `POST /api/python/reward`

Distributes token rewards.

```json
{
  "address": string,
  "amount": number,
  "private_key": string
}
```

#### `POST /api/python/stake`

Stakes NEURO tokens.

```json
{
  "address": string,
  "amount": number,
  "private_key": string
}
```

#### `POST /api/python/unstake`

Unstakes NEURO tokens.

```json
{
  "address": string,
  "private_key": string
}
```

## 🚀 Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
python app.py
```

## 📦 Dependencies

- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- NumPy: Numerical computing
- SciPy: Scientific computing
- Matplotlib: Data visualization
- Web3.py: Ethereum interaction

## ⚙️ Configuration

The server runs on `localhost:5000` by default. Key configurations:

- Maximum data duration: 10 seconds
- Maximum channels: 3
- Sampling rate: 250 Hz (default)

## 🔒 Security Measures

- Input validation for all endpoints
- Data size restrictions
- Rate limiting
- Error handling
- Secure blockchain transactions

## 🧪 Testing

Run tests using:

```bash
python -m pytest tests/
```

## 🔍 Monitoring

The server logs important events:

- API requests and responses
- Processing times
- Error messages
- Blockchain transactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a pull request
