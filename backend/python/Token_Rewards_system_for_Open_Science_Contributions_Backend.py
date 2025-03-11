import os
import json
import traceback
from web3 import Web3

def get_web3():
    return Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def get_contract(web3):
    try:
        # Load contract config
        config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'contracts.config.json')
        with open(config_path) as f:
            config = json.load(f)
        
        # Get NEUROToken contract config
        contract_config = config['NEUROToken']
        
        # Create contract instance
        contract = web3.eth.contract(
            address=web3.to_checksum_address(contract_config['address']),
            abi=contract_config['abi']
        )
        
        return contract
        
    except Exception as e:
        print(f"Error loading contract: {str(e)}")
        raise e

def reward_contributor(contributor_address, amount, private_key):
    web3 = get_web3()
    account = web3.eth.account.from_key(private_key)
    nonce = web3.eth.get_transaction_count(account.address)
    contract = get_contract(web3)
    
    txn = contract.functions.rewardContributor(contributor_address, amount).build_transaction({
        'chainId': 31337,  # Hardhat's chainId
        'gas': 200000,
        'gasPrice': web3.eth.gas_price,
        'nonce': nonce,
        'from': account.address
    })
    signed_txn = account.sign_transaction(txn)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    
    # Wait for transaction receipt
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_receipt

def stake_tokens(address, amount, private_key):
    print("\n=== Starting stake_tokens function ===")
    print(f"Input - Address: {address}")
    print(f"Input - Amount type: {type(amount)}")
    print(f"Input - Amount value: {amount}")
    
    try:
        web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
        print(f"Web3 connection established: {web3.is_connected()}")
        
        # Convert amount to integer if it's a string
        if isinstance(amount, str):
            amount = int(amount)
        
        # Get account from private key using Web3.py v7.x method
        account = web3.eth.account.from_key(private_key)
        print(f"Account address: {account.address}")
        
        # Get contract instance
        contract = get_contract(web3)
        
        # Check balance before staking
        balance = contract.functions.balanceOf(account.address).call()
        print(f"Current balance: {balance}")
        print(f"Attempting to stake: {amount}")
        
        if balance < amount:
            raise ValueError(f"Insufficient balance. Current balance: {balance}, Trying to stake: {amount}")
        
        print("Contract methods available:", contract.functions._functions)
        
        # Get nonce
        nonce = web3.eth.get_transaction_count(account.address)
        print(f"Nonce: {nonce}")
        
        # Build transaction
        transaction = contract.functions.stake(amount).build_transaction({
            'chainId': 31337,  # Hardhat's default chainId
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': account.address
        })
        print("Transaction built successfully")
        
        # Sign transaction
        signed_txn = account.sign_transaction(transaction)
        print("Transaction signed successfully")
        
        # Send transaction
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(f"Transaction hash: {tx_hash.hex()}")
        
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction receipt: {tx_receipt}")
        
        return tx_receipt
        
    except ValueError as e:
        if "Insufficient balance" in str(e):
            print("\n=== Insufficient Balance Error ===")
            print(str(e))
            raise ValueError(str(e))
    except Exception as e:
        print("\n=== Error in stake_tokens ===")
        print(f"Error message: {str(e)}")
        print(f"Error type: {type(e)}")
        print("Stack trace:")
        traceback.print_exc()
        raise e

def unstake_tokens(address, amount, private_key):
    try:
        print("\n=== Starting unstake_tokens function ===")
        print(f"Input - Address: {address}")
        print(f"Input - Amount type: {type(amount)}")
        print(f"Input - Amount value: {amount}")
        
        web3 = get_web3()
        print(f"Web3 connection established: {web3.is_connected()}")
        
        account = web3.eth.account.from_key(private_key)
        print(f"Account address: {account.address}")
        
        nonce = web3.eth.get_transaction_count(account.address)
        print(f"Nonce: {nonce}")
        
        print("Getting contract instance...")
        contract = get_contract(web3)
        print("Contract methods available:", contract.functions._functions)
        
        # Convert amount to int if it's a string
        if isinstance(amount, str):
            print(f"Converting amount from string to int: {amount}")
            amount = int(amount)
        
        print(f"Building transaction with amount: {amount}")
        txn = contract.functions.unstake(amount).build_transaction({
            'chainId': 31337,  # Hardhat chainId
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': account.address,
        })
        print("Transaction built successfully")
        print(f"Transaction details: {txn}")
        
        print("Signing transaction...")
        signed_txn = account.sign_transaction(txn)
        print("Transaction signed successfully")
        
        print("Sending transaction...")
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(f"Transaction sent. Hash: {tx_hash.hex()}")
        
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction receipt: {tx_receipt}")
        
        return tx_receipt
    except Exception as e:
        print("\n=== Error in unstake_tokens ===")
        print(f"Error message: {str(e)}")
        print(f"Error type: {type(e)}")
        print("Stack trace:")
        traceback.print_exc()
        raise e

def mint_tokens(address, amount):
    """
    Mint NEURO tokens to the specified address. This should only be called in development.
    """
    print("\n=== Starting mint_tokens function ===")
    print(f"Input - Address: {address}")
    print(f"Input - Amount: {amount}")
    
    try:
        web3 = get_web3()
        print(f"Web3 connection established: {web3.is_connected()}")
        
        # Convert amount to integer if it's a string
        if isinstance(amount, str):
            amount = int(amount)
        
        # Get contract instance
        contract = get_contract(web3)
        
        # Get the admin account (first account in Hardhat)
        admin = web3.eth.accounts[0]
        admin_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"  # Hardhat's first private key
        
        # Get nonce
        nonce = web3.eth.get_transaction_count(admin)
        
        # Build transaction
        transaction = contract.functions.rewardUser(address, amount).build_transaction({
            'chainId': 31337,  # Hardhat's default chainId
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': admin
        })
        
        # Sign transaction
        account = web3.eth.account.from_key(admin_key)
        signed_txn = account.sign_transaction(transaction)
        
        # Send transaction
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        print(f"Transaction hash: {tx_hash.hex()}")
        
        # Wait for transaction receipt
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction receipt: {tx_receipt}")
        
        return tx_receipt
        
    except Exception as e:
        print("\n=== Error in mint_tokens ===")
        print(f"Error message: {str(e)}")
        print(f"Error type: {type(e)}")
        print("Stack trace:")
        traceback.print_exc()
        raise e

if __name__ == "__main__":
    # Example usage
    reward_contributor("0xContributorAddress", 100, "your_private_key")
    # stake_tokens("0xAddress", 100, "your_private_key")
    # unstake_tokens("0xAddress", "your_private_key")