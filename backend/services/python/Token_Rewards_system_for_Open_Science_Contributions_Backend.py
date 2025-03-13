"""
Backend module for NEURO token management and rewards distribution.
Handles token staking, unstaking, and reward distribution for research contributions.
"""

import os
import json
import traceback
import asyncio
from web3 import Web3
from web3.providers.async_base import AsyncBaseProvider

def get_web3():
    """Initialize and return a Web3 instance connected to the local Hardhat node."""
    provider = Web3.HTTPProvider("http://127.0.0.1:8545")
    if isinstance(provider, AsyncBaseProvider):
        # If using an async provider, ensure we have an event loop
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
    return Web3(provider)

def get_contract(web3):
    """
    Load and return the NEUROToken contract instance.
    
    Args:
        web3: Web3 instance to use for contract interaction
        
    Returns:
        Contract instance for NEUROToken
        
    Raises:
        Exception: If contract configuration cannot be loaded
    """
    try:
        print("\n=== Loading contract configuration ===")
        config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'contracts.config.json')
        print(f"Looking for config file at: {config_path}")
        
        with open(config_path) as f:
            config = json.load(f)
            print("Successfully loaded config file")
            print(f"Available contracts: {list(config.keys())}")
        
        print("\n=== Processing NEUROToken contract ===")
        contract_config = config['NEUROToken']
        print(f"Contract address: {contract_config['address']}")
        print(f"Raw ABI type: {type(contract_config['abi'])}")
        print(f"Raw ABI length: {len(contract_config['abi'])}")
        
        print("\n=== Creating Contract Instance ===")
        address = web3.to_checksum_address(contract_config['address'])
        print(f"Checksummed address: {address}")
        
        try:
            contract = web3.eth.contract(
                address=address,
                abi=contract_config['abi']
            )
            print("Contract instance created successfully")
            print(f"Available contract functions: {[fn for fn in dir(contract.functions) if not fn.startswith('_')]}")
            return contract
        except Exception as e:
            print(f"\n=== Contract Creation Failed ===")
            print(f"Error creating contract: {str(e)}")
            raise
            
    except Exception as e:
        print(f"\n=== Contract Creation Error ===")
        print(f"Error type: {type(e)}")
        print(f"Error message: {str(e)}")
        print(f"Error args: {e.args}")
        print(f"Error location: {traceback.extract_tb(e.__traceback__)[-1]}")
        print(f"Full stack trace:\n{traceback.format_exc()}")
        raise Exception(f"Failed to load contract configuration: {str(e)}")

def reward_contributor(contributor_address, amount, private_key):
    """
    Reward a contributor with NEURO tokens for their research contributions.
    
    Args:
        contributor_address: Ethereum address of the contributor
        amount: Amount of tokens to reward
        private_key: Private key of the sender
        
    Returns:
        Transaction receipt
    """
    web3 = get_web3()
    account = web3.eth.account.from_key(private_key)
    nonce = web3.eth.get_transaction_count(account.address)
    contract = get_contract(web3)
    
    txn = contract.functions.rewardContributor(contributor_address, amount).build_transaction({
        'chainId': 31337,
        'gas': 200000,
        'gasPrice': web3.eth.gas_price,
        'nonce': nonce,
        'from': account.address
    })
    signed_txn = account.sign_transaction(txn)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    return web3.eth.wait_for_transaction_receipt(tx_hash)

def stake_tokens(address, amount, private_key):
    """
    Stake NEURO tokens for governance participation.
    
    Args:
        address: Ethereum address of the staker
        amount: Amount of tokens to stake
        private_key: Private key of the staker
        
    Returns:
        Transaction receipt
        
    Raises:
        ValueError: If user has insufficient balance
        Exception: For other transaction failures
    """
    try:
        print("\n=== Starting stake_tokens function ===")
        print(f"Input parameters:")
        print(f"- Address: {address}")
        print(f"- Amount: {amount}")
        print(f"- Amount type: {type(amount)}")
        
        print("\n=== Initializing Web3 ===")
        web3 = get_web3()
        print(f"Web3 connection established")
        print(f"Connected to network: {web3.net.version}")
        print(f"Latest block number: {web3.eth.block_number}")
        
        if isinstance(amount, str):
            print(f"\nConverting amount from string to int")
            print(f"Original amount: {amount}")
            amount = int(amount)
            print(f"Converted amount: {amount}")
        
        print("\n=== Setting up Account ===")
        account = web3.eth.account.from_key(private_key)
        print(f"Account address: {account.address}")
        print(f"Account matches input address: {account.address.lower() == address.lower()}")
        
        print("\n=== Getting Contract Instance ===")
        contract = get_contract(web3)
        print(f"Contract address: {contract.address}")
        print(f"Available contract functions: {[fn for fn in dir(contract.functions) if not fn.startswith('_')]}")
        
        print("\n=== Checking Balance ===")
        try:
            balance = contract.functions.balanceOf(account.address).call()
            print(f"Balance check successful")
            print(f"Current balance: {balance}")
            print(f"Attempting to stake: {amount}")
            print(f"Balance sufficient: {balance >= amount}")
        except Exception as e:
            print(f"Error checking balance: {str(e)}")
            print(f"Balance check error type: {type(e)}")
            print(f"Balance check error args: {e.args}")
            raise
        
        if balance < amount:
            print(f"\nInsufficient balance detected")
            raise ValueError(f"Insufficient balance. Current balance: {balance}, Trying to stake: {amount}")
        
        print("\n=== Building Transaction ===")
        nonce = web3.eth.get_transaction_count(account.address)
        print(f"Nonce: {nonce}")
        gas_price = web3.eth.gas_price
        print(f"Gas price: {gas_price}")
        
        print("\n=== Creating Stake Transaction ===")
        try:
            # Only pass amount, contract will use msg.sender for the address
            transaction = contract.functions.stake(amount).build_transaction({
                'chainId': 31337,
                'gas': 200000,
                'gasPrice': gas_price,
                'nonce': nonce,
                'from': account.address
            })
            print(f"Transaction built successfully:")
            print(f"- To: {transaction.get('to')}")
            print(f"- From: {transaction.get('from')}")
            print(f"- Value: {transaction.get('value')}")
            print(f"- Gas: {transaction.get('gas')}")
        except Exception as e:
            print(f"\nError building transaction:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            print(f"Error args: {e.args}")
            raise
        
        print("\n=== Signing Transaction ===")
        try:
            signed_txn = account.sign_transaction(transaction)
            print(f"Transaction signed successfully")
            print(f"Raw transaction length: {len(signed_txn.rawTransaction)}")
        except Exception as e:
            print(f"\nError signing transaction:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            raise
        
        print("\n=== Sending Transaction ===")
        try:
            tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            print(f"Transaction sent successfully")
            print(f"Transaction hash: {tx_hash.hex()}")
        except Exception as e:
            print(f"\nError sending transaction:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            raise
        
        print("\n=== Waiting for Receipt ===")
        try:
            receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
            print(f"Transaction receipt received:")
            print(f"- Status: {receipt.get('status')}")
            print(f"- Block number: {receipt.get('blockNumber')}")
            print(f"- Gas used: {receipt.get('gasUsed')}")
            return receipt
        except Exception as e:
            print(f"\nError getting transaction receipt:")
            print(f"Error type: {type(e)}")
            print(f"Error message: {str(e)}")
            raise
        
    except Exception as e:
        print(f"\n=== Stake Error Details ===")
        print(f"Final error type: {type(e)}")
        print(f"Final error message: {str(e)}")
        print(f"Final error args: {e.args}")
        print(f"Error location: {traceback.extract_tb(e.__traceback__)[-1]}")
        print(f"Full stack trace:\n{traceback.format_exc()}")
        raise Exception(f"Failed to stake tokens: {str(e)}")

def unstake_tokens(address, amount, private_key):
    """
    Unstake previously staked NEURO tokens.
    
    Args:
        address: Ethereum address of the unstaker
        amount: Amount of tokens to unstake
        private_key: Private key of the unstaker
        
    Returns:
        Transaction receipt
        
    Raises:
        Exception: If unstaking fails
    """
    try:
        web3 = get_web3()
        account = web3.eth.account.from_key(private_key)
        contract = get_contract(web3)
        
        if isinstance(amount, str):
            amount = int(amount)
        
        nonce = web3.eth.get_transaction_count(account.address)
        # Only pass amount, contract will use msg.sender for the address
        txn = contract.functions.unstake(amount).build_transaction({
            'chainId': 31337,
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': account.address,
        })
        
        signed_txn = account.sign_transaction(txn)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        return web3.eth.wait_for_transaction_receipt(tx_hash)
        
    except Exception as e:
        raise Exception(f"Failed to unstake tokens: {str(e)}")

def mint_tokens(address, amount):
    """
    Mint NEURO tokens to a specified address (development environment only).
    
    Args:
        address: Ethereum address to receive tokens
        amount: Amount of tokens to mint
        
    Returns:
        Transaction receipt
        
    Raises:
        Exception: If minting fails
    """
    try:
        web3 = get_web3()
        if isinstance(amount, str):
            amount = int(amount)
        
        contract = get_contract(web3)
        admin = web3.eth.accounts[0]
        admin_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
        
        nonce = web3.eth.get_transaction_count(admin)
        transaction = contract.functions.rewardUser(address, amount).build_transaction({
            'chainId': 31337,
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': admin
        })
        
        account = web3.eth.account.from_key(admin_key)
        signed_txn = account.sign_transaction(transaction)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        return web3.eth.wait_for_transaction_receipt(tx_hash)
        
    except Exception as e:
        raise Exception(f"Failed to mint tokens: {str(e)}")

if __name__ == "__main__":
    # Example usage
    reward_contributor("0xContributorAddress", 100, "your_private_key")
    # stake_tokens("0xAddress", 100, "your_private_key")
    # unstake_tokens("0xAddress", "your_private_key")