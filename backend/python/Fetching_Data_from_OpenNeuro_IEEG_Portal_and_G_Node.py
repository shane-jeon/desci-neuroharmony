import requests
import os
import neo
from neo.io import BlackrockIO, NeuralynxIO, PlexonIO
import numpy as np

# Function to fetch data from OpenNeuro
def fetch_openneuro_data(dataset_id):
    url = f"https://openneuro.org/datasets/{dataset_id}/snapshot/1/files"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from OpenNeuro: {response.status_code}")

# Function to fetch data from IEEG Portal
def fetch_ieeg_data(dataset_id):
    url = f"https://www.ieeg.org/api/data/{dataset_id}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from IEEG Portal: {response.status_code}")

# Function to fetch data from G-Node
def fetch_g_node_data(dataset_id):
    url = f"https://doi.gin.g-node.org/{dataset_id}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data from G-Node: {response.status_code}")

# Function to standardize data using Neo
def standardize_data(file_path, file_format):
    if file_format == "blackrock":
        reader = BlackrockIO(filename=file_path)
    elif file_format == "neuralynx":
        reader = NeuralynxIO(filename=file_path)
    elif file_format == "plexon":
        reader = PlexonIO(filename=file_path)
    else:
        raise ValueError("Unsupported file format")

    block = reader.read_block()
    return block

# Example usage
openneuro_data = fetch_openneuro_data("ds000001")
ieeg_data = fetch_ieeg_data("ieeg_dataset_001")
g_node_data = fetch_g_node_data("g_node_dataset_001")

# Standardize data
blackrock_data = standardize_data("data/file1.br", "blackrock")
neuralynx_data = standardize_data("data/file2.nlx", "neuralynx")
plexon_data = standardize_data("data/file3.plx", "plexon")