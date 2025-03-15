from flask import Blueprint, jsonify, request
from data_processing.neuro_data_processor import NeuroDataProcessor
import os
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

neuro_data_bp = Blueprint('neuro_data', __name__)

# Initialize the data processor with the datasets path - pointing to backend/datasets
datasets_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'datasets')
logger.info(f"Initializing NeuroDataProcessor with base path: {datasets_path}")
data_processor = NeuroDataProcessor(datasets_path)

@neuro_data_bp.route('/eeg/<subject_id>', methods=['GET'])
def get_eeg_data(subject_id):
    """Get EEG data for a specific subject"""
    try:
        data = data_processor.load_eeg_data(subject_id)
        return jsonify({
            'success': True,
            'data': data
        })
    except FileNotFoundError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@neuro_data_bp.route('/eog/<version>/<participant>', methods=['GET'])
def get_eog_data(version, participant):
    """Get EOG data for a specific participant and version"""
    logger.info(f"Received EOG data request - version: {version}, participant: {participant}")
    session = request.args.get('session')
    logger.info(f"Session parameter: {session}")
    
    try:
        logger.info("Attempting to load EOG data...")
        data = data_processor.load_eog_data(version, participant, session)
        logger.info(f"Successfully loaded EOG data: {len(data['data'])} channels, {len(data['data'][0])} samples per channel")
        response = {
            'success': True,
            'data': data
        }
        logger.info("Sending EOG data response")
        return jsonify(response)
    except FileNotFoundError as e:
        logger.error(f"File not found error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 404
    except Exception as e:
        logger.error(f"Error loading EOG data: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@neuro_data_bp.route('/eeg/subjects', methods=['GET'])
def get_subjects():
    """Get list of available EEG subjects"""
    try:
        logger.info("Attempting to get available subjects")
        subjects = data_processor.get_available_subjects()
        logger.info(f"Found {len(subjects)} subjects: {subjects}")
        return jsonify({
            'success': True,
            'subjects': subjects
        })
    except Exception as e:
        logger.error(f"Error getting subjects: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@neuro_data_bp.route('/eog/<version>/<participant>/sessions', methods=['GET'])
def get_available_sessions(version, participant):
    """Get list of available sessions for an EOG participant"""
    try:
        sessions = data_processor.get_available_eog_sessions(version, participant)
        return jsonify({
            'success': True,
            'sessions': sessions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500 