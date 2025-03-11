"""
Backend module for NEURO token management and rewards distribution.
Handles token staking, unstaking, and reward distribution for research contributions.
"""

import os
import json
import traceback
from web3 import Web3

def get_web3():
    """Initialize and return a Web3 instance connected to the local Hardhat node."""
    return Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

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
        config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'contracts.config.json')
        with open(config_path) as f:
            config = json.load(f)
        
        contract_config = config['NEUROToken']
        contract = web3.eth.contract(
            address=web3.to_checksum_address(contract_config['address']),
            abi=contract_config['abi']
        )
        return contract
    except Exception as e:
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
        web3 = get_web3()
        if isinstance(amount, str):
            amount = int(amount)
        
        account = web3.eth.account.from_key(private_key)
        contract = get_contract(web3)
        
        balance = contract.functions.balanceOf(account.address).call()
        if balance < amount:
            raise ValueError(f"Insufficient balance. Current balance: {balance}, Trying to stake: {amount}")
        
        nonce = web3.eth.get_transaction_count(account.address)
        transaction = contract.functions.stake(amount).build_transaction({
            'chainId': 31337,
            'gas': 200000,
            'gasPrice': web3.eth.gas_price,
            'nonce': nonce,
            'from': account.address
        })
        
        signed_txn = account.sign_transaction(transaction)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)
        return web3.eth.wait_for_transaction_receipt(tx_hash)
        
    except Exception as e:
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