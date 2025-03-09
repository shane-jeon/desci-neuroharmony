import matplotlib.pyplot as plt

# Function to visualize EEG data
def visualize_eeg_data(block):
    for segment in block.segments:
        for analog_signal in segment.analogsignals:
            plt.plot(analog_signal.times, analog_signal)
            plt.title("EEG Signal")
            plt.xlabel("Time (s)")
            plt.ylabel("Amplitude (µV)")
            plt.show()

# Example usage
visualize_eeg_data(blackrock_data)