"""
Flask server providing API endpoints for the NeuroHarmony platform.
Handles data processing, blockchain interactions, and research collaboration features.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import traceback
import logging
import asyncio
import nest_asyncio
import os
import json
from web3.datastructures import AttributeDict
from hexbytes import HexBytes
from Token_Rewards_system_for_Open_Science_Contributions_Backend import (
    stake_tokens, unstake_tokens, reward_contributor, mint_tokens
)
from routes.neuro_data_routes import neuro_data_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Configure CORS with additional options
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(neuro_data_bp, url_prefix='/api/neuro')

def convert_to_json_serializable(obj):
    """Convert Web3 objects to JSON-serializable format."""
    if isinstance(obj, HexBytes):
        return obj.hex()
    elif isinstance(obj, AttributeDict):
        return {key: convert_to_json_serializable(value) for key, value in dict(obj).items()}
    elif isinstance(obj, (tuple, list)):
        return [convert_to_json_serializable(item) for item in obj]
    elif isinstance(obj, dict):
        return {key: convert_to_json_serializable(value) for key, value in obj.items()}
    return obj

def run_in_event_loop(coro):
    """
    Helper function to run coroutines in the current thread's event loop.
    Creates a new event loop if one doesn't exist.
    """
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)

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

@app.route('/reward', methods=['POST'])
def reward_contributor_endpoint():
    try:
        logger.info("Received reward request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        required_fields = ['address', 'amount', 'privateKey']
        if not all(field in data for field in required_fields):
            logger.error("Missing required fields in request")
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Create a new event loop for this request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            receipt = reward_contributor(
                contributor_address=data['address'],
                amount=data['amount'],
                private_key=data['privateKey']
            )
            logger.info(f"Reward successful. Receipt: {receipt}")
            # Convert receipt to JSON-serializable format
            serialized_receipt = convert_to_json_serializable(receipt)
            return jsonify({'success': True, 'receipt': serialized_receipt}), 200
            
        except ValueError as e:
            logger.error(f"Validation error in reward_contributor: {str(e)}")
            return jsonify({'error': str(e)}), 400
            
        except Exception as e:
            logger.error(f"Error in reward_contributor: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Unexpected error in reward endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/python/stake', methods=['POST', 'OPTIONS'])
def stake_tokens_endpoint():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        logger.info("Received stake request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        required_fields = ['address', 'amount', 'privateKey']
        if not all(field in data for field in required_fields):
            logger.error("Missing required fields in request")
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Create a new event loop for this request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            receipt = stake_tokens(
                address=data['address'],
                amount=data['amount'],
                private_key=data['privateKey']
            )
            logger.info(f"Stake successful. Receipt: {receipt}")
            # Convert receipt to JSON-serializable format
            serialized_receipt = convert_to_json_serializable(receipt)
            return jsonify({'success': True, 'receipt': serialized_receipt}), 200
            
        except ValueError as e:
            logger.error(f"Validation error in stake_tokens: {str(e)}")
            return jsonify({'error': str(e)}), 400
            
        except Exception as e:
            logger.error(f"Error in stake_tokens: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Unexpected error in stake endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/python/unstake', methods=['POST', 'OPTIONS'])
def unstake_tokens_endpoint():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        logger.info("Received unstake request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        required_fields = ['address', 'amount', 'privateKey']
        if not all(field in data for field in required_fields):
            logger.error("Missing required fields in request")
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Create a new event loop for this request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            receipt = unstake_tokens(
                address=data['address'],
                amount=data['amount'],
                private_key=data['privateKey']
            )
            logger.info(f"Unstake successful. Receipt: {receipt}")
            # Convert receipt to JSON-serializable format
            serialized_receipt = convert_to_json_serializable(receipt)
            return jsonify({'success': True, 'receipt': serialized_receipt}), 200
            
        except ValueError as e:
            logger.error(f"Validation error in unstake_tokens: {str(e)}")
            return jsonify({'error': str(e)}), 400
            
        except Exception as e:
            logger.error(f"Error in unstake_tokens: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Unexpected error in unstake endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

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

@app.route('/mint', methods=['POST'])
def mint_tokens_endpoint():
    try:
        logger.info("Received mint request")
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        required_fields = ['address', 'amount']
        if not all(field in data for field in required_fields):
            logger.error("Missing required fields in request")
            return jsonify({'error': 'Missing required fields'}), 400
            
        # Create a new event loop for this request
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            receipt = mint_tokens(
                address=data['address'],
                amount=data['amount']
            )
            logger.info(f"Mint successful. Receipt: {receipt}")
            return jsonify({'success': True, 'receipt': dict(receipt)}), 200
            
        except ValueError as e:
            logger.error(f"Validation error in mint_tokens: {str(e)}")
            return jsonify({'error': str(e)}), 400
            
        except Exception as e:
            logger.error(f"Error in mint_tokens: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Unexpected error in mint endpoint: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=False) 