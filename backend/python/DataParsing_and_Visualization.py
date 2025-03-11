import matplotlib
matplotlib.use('Agg')  # Set backend before importing pyplot
import matplotlib.pyplot as plt
import numpy as np
import io
import base64
import time
from scipy import signal
import json
import traceback
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Function to visualize EEG data
def visualize_eeg_data(data):
    try:
        start_time = time.time()
        logger.info("Starting visualization...")

        # Verify data structure
        if data is None:
            data = {}
        
        # Create figure
        try:
            fig, ax = plt.subplots(figsize=(8, 4), dpi=80)
        except Exception as e:
            logger.error(f"Error creating figure: {str(e)}")
            raise
        
        try:
            # If data is mock data, create a sample visualization
            if not data or isinstance(data, dict):
                logger.info("Generating mock data...")
                # Generate sample data based on metadata if available
                sampling_rate = data.get('metadata', {}).get('samplingRate', 250)  # Default to 250 Hz
                duration = min(data.get('metadata', {}).get('duration', 5), 5)  # Limit to 5s for better performance
                channels = min(data.get('metadata', {}).get('channels', 1), 3)  # Limit to 3 channels
                
                # Generate time points more efficiently using fewer points
                num_points = int(sampling_rate * duration / 2)  # Reduce number of points
                t = np.linspace(0, duration, num_points)
                
                # Pre-allocate arrays for better performance
                signals = np.zeros((channels, len(t)))
                
                # Generate sample EEG data more efficiently
                for channel in range(channels):
                    amplitude = np.random.uniform(0.5, 1.0)
                    phase = np.random.uniform(0, 2*np.pi)
                    signals[channel] = amplitude * np.sin(2 * np.pi * 10 * t + phase) + \
                                     np.random.normal(0, 0.1, len(t)) + channel*2
                    # Use faster plotting method
                    ax.plot(t, signals[channel], '-', linewidth=1, label=f'Channel {channel+1}')
            else:
                logger.info("Processing real data...")
                t = np.array(data.get('times', []))
                signals = np.array(data.get('signals', []))
                
                if len(t) == 0 or len(signals) == 0:
                    raise ValueError("Empty data arrays provided")
                
                # Downsample if too many points
                if len(t) > 1000:
                    downsample_factor = len(t) // 1000
                    t = t[::downsample_factor]
                    signals = signals[:, ::downsample_factor]
                
                for i, signal in enumerate(signals):
                    ax.plot(t, signal, '-', linewidth=1, label=f'Channel {i+1}')

            # Optimize plot settings
            ax.set_title("EEG Signal Visualization")
            ax.set_xlabel("Time (s)")
            ax.set_ylabel("Amplitude (µV)")
            ax.legend(loc='upper right', fontsize='small')
            ax.grid(True, alpha=0.3)

            # Optimize figure layout
            plt.tight_layout()

            # Save plot with optimized settings
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=80,
                       pad_inches=0.1)
            buf.seek(0)
            plt.close(fig)  # Explicitly close the figure

            # Encode the image to base64
            image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            
            end_time = time.time()
            logger.info(f"Visualization completed in {end_time - start_time:.2f} seconds")
            return image_base64

        except Exception as e:
            logger.error(f"Error during data processing: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    except Exception as e:
        logger.error(f"Error in visualization: {str(e)}")
        logger.error(traceback.format_exc())
        return None

    finally:
        # Clean up any remaining plots
        plt.close('all')

def perform_frequency_analysis(data):
    try:
        start_time = time.time()
        print("Starting frequency analysis...")

        plt.switch_backend('Agg')
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 8), dpi=100)
        
        if not data or isinstance(data, dict):
            print("Generating mock data for analysis...")
            sampling_rate = data.get('metadata', {}).get('samplingRate', 250)  # Default to 250 Hz
            duration = min(data.get('metadata', {}).get('duration', 10), 10)
            channels = min(data.get('metadata', {}).get('channels', 1), 3)
            
            t = np.linspace(0, duration, int(sampling_rate * duration))
            signals = np.zeros((channels, len(t)))
            
            # Generate sample data with multiple frequency components
            for channel in range(channels):
                # Alpha waves (8-13 Hz)
                alpha = np.sin(2 * np.pi * 10 * t)
                # Beta waves (13-30 Hz)
                beta = 0.5 * np.sin(2 * np.pi * 20 * t)
                # Theta waves (4-8 Hz)
                theta = 0.3 * np.sin(2 * np.pi * 6 * t)
                
                signals[channel] = alpha + beta + theta + np.random.normal(0, 0.1, len(t))
                
                # Plot time domain signal
                ax1.plot(t, signals[channel], label=f'Channel {channel+1}')
                
                # Compute and plot frequency domain
                freqs, psd = signal.welch(signals[channel], fs=sampling_rate, nperseg=1024)
                ax2.semilogy(freqs, psd, label=f'Channel {channel+1}')
        else:
            print("Processing real data for analysis...")
            t = np.array(data.get('times', []))
            signals = np.array(data.get('signals', []))
            sampling_rate = len(t) / (t[-1] - t[0]) if len(t) > 1 else 250
            
            for i, signal_data in enumerate(signals):
                # Plot time domain signal
                ax1.plot(t, signal_data, label=f'Channel {i+1}')
                
                # Compute and plot frequency domain
                freqs, psd = signal.welch(signal_data, fs=sampling_rate, nperseg=1024)
                ax2.semilogy(freqs, psd, label=f'Channel {i+1}')

        # Configure time domain plot
        ax1.set_title("EEG Signal - Time Domain")
        ax1.set_xlabel("Time (s)")
        ax1.set_ylabel("Amplitude (µV)")
        ax1.legend()
        ax1.grid(True)

        # Configure frequency domain plot
        ax2.set_title("EEG Signal - Frequency Domain")
        ax2.set_xlabel("Frequency (Hz)")
        ax2.set_ylabel("Power Spectral Density (µV²/Hz)")
        ax2.legend()
        ax2.grid(True)

        # Add frequency band annotations
        ax2.axvspan(0.5, 4, alpha=0.2, color='gray', label='Delta (0.5-4 Hz)')
        ax2.axvspan(4, 8, alpha=0.2, color='blue', label='Theta (4-8 Hz)')
        ax2.axvspan(8, 13, alpha=0.2, color='green', label='Alpha (8-13 Hz)')
        ax2.axvspan(13, 30, alpha=0.2, color='red', label='Beta (13-30 Hz)')
        ax2.axvspan(30, 100, alpha=0.2, color='purple', label='Gamma (30-100 Hz)')

        plt.tight_layout()

        # Save plot to bytes buffer
        print("Saving analysis plot...")
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)
        plt.close(fig)

        # Encode the image to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        
        end_time = time.time()
        print(f"Frequency analysis completed in {end_time - start_time:.2f} seconds")
        
        return {
            "image": image_base64,
            "bands": {
                "delta": {"range": "0.5-4 Hz", "description": "Deep sleep, unconscious"},
                "theta": {"range": "4-8 Hz", "description": "Drowsiness, meditation"},
                "alpha": {"range": "8-13 Hz", "description": "Relaxed, eyes closed"},
                "beta": {"range": "13-30 Hz", "description": "Active thinking, focus"},
                "gamma": {"range": "30-100 Hz", "description": "Cognitive processing"}
            }
        }

    except Exception as e:
        print(f"Error in frequency analysis: {str(e)}")
        return None

def export_data(data):
    try:
        if not data or isinstance(data, dict):
            # Generate sample data based on metadata if available
            sampling_rate = data.get('metadata', {}).get('samplingRate', 250)
            duration = min(data.get('metadata', {}).get('duration', 10), 10)
            channels = min(data.get('metadata', {}).get('channels', 1), 3)
            
            # Generate time points
            t = np.linspace(0, duration, int(sampling_rate * duration))
            
            # Generate sample data
            signals = np.zeros((channels, len(t)))
            for channel in range(channels):
                amplitude = np.random.uniform(0.5, 1.0)
                phase = np.random.uniform(0, 2*np.pi)
                signals[channel] = amplitude * np.sin(2 * np.pi * 10 * t + phase) + \
                                 np.random.normal(0, 0.1, len(t))
        else:
            t = np.array(data.get('times', []))
            signals = np.array(data.get('signals', []))

        # Create export data structure
        export_data = {
            "metadata": data.get('metadata', {}),
            "data": {
                "times": t.tolist(),
                "signals": signals.tolist(),
                "channels": len(signals) if isinstance(signals, np.ndarray) else 0,
                "samplingRate": data.get('metadata', {}).get('samplingRate', 250),
                "duration": len(t) / data.get('metadata', {}).get('samplingRate', 250) if len(t) > 0 else 0
            },
            "exportTime": time.strftime("%Y-%m-%d %H:%M:%S"),
            "dataType": data.get('dataType', 'EEG')
        }

        return export_data

    except Exception as e:
        print(f"Error in data export: {str(e)}")
        return None

if __name__ == "__main__":
    # Example usage
    mock_data = {
        "metadata": {
            "samplingRate": 250,
            "channels": 3,
            "duration": 10
        }
    }
    visualize_eeg_data(mock_data)