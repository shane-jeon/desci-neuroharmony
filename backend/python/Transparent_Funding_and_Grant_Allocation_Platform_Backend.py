def create_grant(title, description, amount, private_key):
    account = web3.eth.account.privateKeyToAccount(private_key)
    nonce = web3.eth.getTransactionCount(account.address)
    txn = contract.functions.createGrant(title, description, amount).buildTransaction({
        'chainId': 1,
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': nonce,
    })
    signed_txn = web3.eth.account.signTransaction(txn, private_key=private_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return txn_hash.hex()

# Example usage
create_grant("ALS Research", "Funding for ALS treatment development.", 100000, "your_private_key")