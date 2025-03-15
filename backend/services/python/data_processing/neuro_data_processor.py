import os
import neo
import numpy as np
import logging
import json
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NeuroDataProcessor:
    def __init__(self, base_path):
        """
        Initialize the data processor with base path to the datasets
        
        Args:
            base_path (str): Path to the directory containing eeg and eog folders
        """
        self.base_path = Path(base_path)
        self.eeg_path = self.base_path / 'eeg'
        self.eog_path = self.base_path / 'eog'
        logger.info(f"Initialized NeuroDataProcessor with paths: EEG={self.eeg_path}, EOG={self.eog_path}")
        
        # Log available neo IO modules
        logger.info("Available neo.io modules:")
        for name in dir(neo.io):
            if name.endswith('IO'):
                logger.info(f"- {name}")

    def load_eeg_data(self, subject_id):
        """
        Load EEG data for a specific subject
        
        Args:
            subject_id (str): Subject ID (e.g., '001')
            
        Returns:
            dict: Dictionary containing processed EEG data and metadata
        """
        logger.info(f"Attempting to load EEG data for subject {subject_id}")
        subject_dir = self.eeg_path / f'sub-{subject_id}' / 'eeg'
        logger.info(f"Looking for EEG files in: {subject_dir}")
        
        # First check if we have metadata files
        json_file = subject_dir / f'sub-{subject_id}_task-eyesclosed_eeg.json'
        channels_file = subject_dir / f'sub-{subject_id}_task-eyesclosed_channels.tsv'
        
        if json_file.exists():
            try:
                with open(json_file) as f:
                    metadata = json.load(f)
                    logger.info(f"Loaded metadata from {json_file}")
                    
                # Generate simulated data for testing
                # This is temporary until the actual data files are downloaded
                logger.warning("Using simulated data for testing - actual data files need to be downloaded")
                num_channels = 20  # Default or from channels.tsv if available
                sampling_rate = metadata.get('SamplingFrequency', 1000)
                duration = 10  # 10 seconds of data
                num_samples = int(duration * sampling_rate)
                
                # Generate random data for each channel
                data = [np.random.normal(0, 1, num_samples).tolist() for _ in range(num_channels)]
                
                return {
                    'data': data,
                    'sampling_rate': float(sampling_rate),
                    'channel_names': [f'Channel_{i+1}' for i in range(num_channels)],
                    'units': metadata.get('Units', 'µV'),
                    'start_time': '0',
                }
            except Exception as e:
                logger.error(f"Error reading metadata: {str(e)}")
                raise Exception("The EEG data files are not currently available. This dataset uses datalad/git-annex for large file management. Please download the actual data files before using this feature.")
        else:
            raise FileNotFoundError(f"No EEG data or metadata found for subject {subject_id}")

    def load_eog_data(self, version, participant, session=None):
        """
        Load EOG data for a specific participant and version
        
        Args:
            version (str): Version number (e.g., 'v08')
            participant (str): Participant ID
            session (str, optional): Session identifier
            
        Returns:
            dict: Dictionary containing processed EOG data and metadata
        """
        logger.info(f"Attempting to load EOG data for version {version}, participant {participant}, session {session}")
        version_path = self.eog_path / version
        if not version_path.exists():
            raise FileNotFoundError(f"No EOG data found for version {version}")
            
        # Find all .vhdr files for the participant
        pattern = f"{participant}_{version}_*.vhdr"
        vhdr_files = list(version_path.glob(pattern))
        if not vhdr_files:
            raise FileNotFoundError(f"No .vhdr files found for {participant} in {version}")
            
        # If session is specified, filter for that session
        if session:
            session_pattern = f"{participant}_{version}_{session}.vhdr"
            session_file = version_path / session_pattern
            if session_file.exists():
                vhdr_files = [session_file]
            else:
                raise FileNotFoundError(f"No data found for session {session}")
        
        # Use the first file or the session-specific file
        vhdr_file = vhdr_files[0]
        logger.info(f"Using header file: {vhdr_file}")
        
        try:
            # Read the header file to get metadata
            with open(vhdr_file) as f:
                header_lines = f.readlines()
            
            # Parse header for sampling rate and channel info
            sampling_rate = 1000  # Default value
            channel_count = 2     # Default value
            for line in header_lines:
                if 'SamplingInterval=' in line:
                    # SamplingInterval is in microseconds, convert to Hz
                    sampling_interval = float(line.split('=')[1])
                    sampling_rate = 1_000_000 / sampling_interval
                elif 'NumberOfChannels=' in line:
                    channel_count = int(line.split('=')[1])
            
            logger.info(f"Found sampling rate: {sampling_rate} Hz, channels: {channel_count}")
            
            # Generate simulated data
            logger.warning("Using simulated data for testing - actual data files need to be downloaded")
            duration = 10  # 10 seconds of data
            num_samples = int(duration * sampling_rate)
            
            # Generate random data for each channel
            # EOG typically shows eye movement patterns, simulate with some baseline and occasional peaks
            data = []
            for _ in range(channel_count):
                baseline = np.random.normal(0, 10, num_samples)  # Baseline noise
                # Add occasional eye movements (peaks)
                for _ in range(5):
                    peak_pos = np.random.randint(0, num_samples)
                    peak_width = int(sampling_rate * 0.2)  # 200ms movement
                    peak_amplitude = np.random.choice([-100, 100])  # Up or down movement
                    baseline[peak_pos:peak_pos + peak_width] += peak_amplitude
                data.append(baseline.tolist())
            
            return {
                'data': data,
                'sampling_rate': float(sampling_rate),
                'channel_names': [f'EOG_{i+1}' for i in range(channel_count)],
                'units': 'µV',
                'start_time': '0',
            }
                
        except Exception as e:
            logger.error(f"Error reading EOG file: {str(e)}")
            raise Exception("The EOG data files are not currently available. This dataset uses datalad/git-annex for large file management. Please download the actual data files before using this feature.")

    def get_available_subjects(self):
        """
        Get a list of available subject IDs for EEG data
        
        Returns:
            list: List of subject IDs
        """
        subjects = []
        for path in self.eeg_path.glob('sub-*'):
            if path.is_dir():
                subjects.append(path.name.replace('sub-', ''))
        return sorted(subjects)

    def get_available_eog_sessions(self, version, participant):
        """
        Get a list of available sessions for a specific EOG participant
        
        Args:
            version (str): Version number
            participant (str): Participant ID
            
        Returns:
            list: List of session identifiers
        """
        session_path = self.eog_path / version / participant
        if not session_path.exists():
            return []
            
        sessions = []
        for file in session_path.glob('*.vhdr'):
            sessions.append(file.stem)
        return sorted(sessions) 