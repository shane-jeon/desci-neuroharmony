import requests
from web3 import Web3
import json
import os

def get_web3():
    return Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))  # Using local Hardhat node

def get_contract(web3):
    try:
        # Load contract config
        config_path = os.path.join(os.path.dirname(__file__), "..", "config", "contracts.config.json")
        with open(config_path) as f:
            config = json.load(f)
        
        # Get ResearchCollaboration contract config
        contract_config = config["ResearchCollaboration"]
        contract = web3.eth.contract(
            address=contract_config["address"],
            abi=contract_config["abi"]
        )
        return contract
    except Exception as e:
        print(f"Error loading contract: {str(e)}")
        raise

def create_project(title, description, private_key):
    try:
        web3 = get_web3()
        if not web3.is_connected():
            raise Exception("Not connected to Web3 provider")
            
        contract = get_contract(web3)
        account = web3.eth.account.from_key(private_key)
        nonce = web3.eth.get_transaction_count(account.address)
        
        txn = contract.functions.createProject(title, description).build_transaction({
            'chainId': 31337,  # Hardhat chainId
            'gas': 2000000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': account.address,
        })
        
        signed_txn = web3.eth.account.sign_transaction(txn, private_key=private_key)
        txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return txn_hash.hex()
    except Exception as e:
        print(f"Error in create_project: {str(e)}")
        raise

if __name__ == "__main__":
    # Example usage
    create_project("Decentralized Science", "A project to revolutionize research.", "your_private_key")