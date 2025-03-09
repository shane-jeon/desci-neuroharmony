import requests
from web3 import Web3

# Connect to Ethereum node
web3 = Web3(Web3.HTTPProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"))

# Load contract ABI and address
contract_abi = [...]  # ABI of the deployed ResearchCollaboration contract
contract_address = "0xYourContractAddress"
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

def create_project(title, description, private_key):
    account = web3.eth.account.privateKeyToAccount(private_key)
    nonce = web3.eth.getTransactionCount(account.address)
    txn = contract.functions.createProject(title, description).buildTransaction({
        'chainId': 1,
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.signTransaction(txn, private_key=private_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return txn_hash.hex()

# Example usage
create_project("Decentralized Science", "A project to revolutionize research.", "your_private_key")