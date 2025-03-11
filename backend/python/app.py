"""
Flask server providing API endpoints for the NeuroHarmony platform.
Handles data processing, blockchain interactions, and research collaboration features.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import traceback
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/python/fetch-data', methods=['GET'])
def fetch_data():
    """Fetch neuroscience dataset from OpenNeuro."""
    try:
        import Fetching_Data
        data = Fetching_Data.fetch_openneuro_data("ds000001")
        return jsonify({"success": True, "data": data})
    except Exception as e:
        logger.error(f"Error fetching data: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/visualize', methods=['POST'])
def visualize_data():
    """Generate visualization for EEG data."""
    try:
        import DataParsing_and_Visualization
        data = request.json
        
        if data and isinstance(data, dict):
            metadata = data.get('metadata', {})
            # Limit duration and channels for performance
            if metadata.get('duration', 0) > 10:
                metadata['duration'] = 10
            if metadata.get('channels', 0) > 3:
                metadata['channels'] = 3
            data['metadata'] = metadata
        
        result = DataParsing_and_Visualization.visualize_eeg_data(data)
        if result:
            return jsonify({"success": True, "result": result})
        else:
            return jsonify({"success": False, "error": "Failed to generate visualization"}), 500
    except Exception as e:
        logger.error(f"Visualization error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/research-hub', methods=['POST'])
def research_hub_integration():
    """Post research data to ResearchHub."""
    try:
        import Integration_with_ResearchHub
        data = request.json
        result = Integration_with_ResearchHub.post_to_researchhub(
            title=data.get('title'),
            content=data.get('content'),
            dataset_link=data.get('dataset_link')
        )
        return jsonify({"success": True, "data": result})
    except Exception as e:
        logger.error(f"ResearchHub integration error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/reward', methods=['POST'])
def reward_contributor():
    """Distribute NEURO token rewards to contributors."""
    try:
        import Token_Rewards_system_for_Open_Science_Contributions_Backend as TokenRewards
        data = request.json
        result = TokenRewards.reward_contributor(
            contributor_address=data.get('address'),
            amount=data.get('amount'),
            private_key=data.get('private_key')
        )
        return jsonify({"success": True, "transaction": result})
    except Exception as e:
        logger.error(f"Reward distribution error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/stake', methods=['POST'])
def stake_tokens():
    """Stake NEURO tokens for governance participation."""
    try:
        import Token_Rewards_system_for_Open_Science_Contributions_Backend as TokenRewards
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
            
        address = data.get('address')
        amount = data.get('amount')
        private_key = data.get('private_key')
        
        if not all([address, amount, private_key]):
            missing = [field for field, value in 
                      {'address': address, 'amount': amount, 'private_key': private_key}.items() 
                      if not value]
            return jsonify({
                "success": False, 
                "error": f"Missing required parameters: {', '.join(missing)}"
            }), 400
            
        result = TokenRewards.stake_tokens(
            address=address,
            amount=amount,
            private_key=private_key
        )
        return jsonify({"success": True, "transaction": result})
    except ValueError as e:
        if "Insufficient balance" in str(e):
            return jsonify({
                "success": False,
                "error": str(e),
                "errorType": "INSUFFICIENT_BALANCE"
            }), 400
    except Exception as e:
        logger.error(f"Staking error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/unstake', methods=['POST'])
def unstake_tokens():
    """Unstake previously staked NEURO tokens."""
    try:
        import Token_Rewards_system_for_Open_Science_Contributions_Backend as TokenRewards
        data = request.json
        result = TokenRewards.unstake_tokens(
            address=data.get('address'),
            amount=data.get('amount'),
            private_key=data.get('private_key')
        )
        return jsonify({"success": True, "transaction": result})
    except Exception as e:
        logger.error(f"Unstaking error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/grant', methods=['POST'])
def create_grant():
    """Create a new research grant proposal."""
    try:
        import Transparent_Funding_and_Grant_Allocation_Platform_Backend as FundingPlatform
        data = request.json
        result = FundingPlatform.create_grant(
            title=data.get('title'),
            description=data.get('description'),
            amount=data.get('amount'),
            private_key=data.get('private_key')
        )
        return jsonify({"success": True, "transaction": result})
    except Exception as e:
        logger.error(f"Grant creation error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/project', methods=['POST'])
def create_project():
    """Create a new research collaboration project."""
    try:
        import Decentralized_Collaboration_Platform_for_Researchers_Backend as CollabPlatform
        data = request.json
        result = CollabPlatform.create_project(
            title=data.get('title'),
            description=data.get('description'),
            private_key=data.get('private_key')
        )
        return jsonify({"success": True, "transaction": result})
    except Exception as e:
        logger.error(f"Project creation error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/analyze', methods=['POST'])
def analyze_data():
    """Perform frequency analysis on EEG data."""
    try:
        import DataParsing_and_Visualization
        data = request.json
        
        if data and isinstance(data, dict):
            metadata = data.get('metadata', {})
            if metadata.get('duration', 0) > 10:
                metadata['duration'] = 10
            if metadata.get('channels', 0) > 3:
                metadata['channels'] = 3
            data['metadata'] = metadata
        
        result = DataParsing_and_Visualization.perform_frequency_analysis(data)
        if result:
            return jsonify({
                "success": True,
                "result": result["image"],
                "bands": result["bands"]
            })
        else:
            return jsonify({"success": False, "error": "Failed to perform frequency analysis"}), 500
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/export', methods=['POST'])
def export_data():
    """Export processed EEG data in JSON format."""
    try:
        import DataParsing_and_Visualization
        data = request.json
        
        if data and isinstance(data, dict):
            metadata = data.get('metadata', {})
            if metadata.get('duration', 0) > 10:
                metadata['duration'] = 10
            if metadata.get('channels', 0) > 3:
                metadata['channels'] = 3
            data['metadata'] = metadata
        
        result = DataParsing_and_Visualization.export_data(data)
        if result:
            return jsonify({
                "success": True,
                "data": result,
                "filename": f"eeg_data_export_{time.strftime('%Y%m%d_%H%M%S')}.json"
            })
        else:
            return jsonify({"success": False, "error": "Failed to export data"}), 500
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/python/mint', methods=['POST'])
def mint_tokens():
    """Mint NEURO tokens (development environment only)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        address = data.get('address')
        amount = data.get('amount')
        
        if not address or not amount:
            return jsonify({"error": "Missing required parameters"}), 400
            
        import Token_Rewards_system_for_Open_Science_Contributions_Backend as TokenRewards
        result = TokenRewards.mint_tokens(address, amount)
        
        return jsonify({
            "success": True,
            "message": "Tokens minted successfully",
            "transaction": result
        }), 200
        
    except Exception as e:
        logger.error(f"Minting error: {str(e)}")
        return jsonify({
            "error": str(e),
            "type": str(type(e))
        }), 500

if __name__ == "__main__":
    app.run(port=5000, debug=False) 