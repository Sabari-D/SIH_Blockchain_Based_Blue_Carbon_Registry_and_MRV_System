import os
import json
# pyrefly: ignore [missing-import]
from web3 import Web3
try:
    from web3.middleware import ExtraDataToPOAMiddleware as geth_poa_middleware
except ImportError:
    from web3.middleware import geth_poa_middleware
from app.config import settings

# Connect to Ethereum RPC node
w3 = Web3(Web3.HTTPProvider(settings.RPC_URL))
# For compatibility with PoA chains like Polygon Amoy
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

APP_DIR = os.path.dirname(os.path.abspath(__file__))

def load_contract_metadata():
    try:
        with open(os.path.join(APP_DIR, "contracts.json"), "r") as f:
            addresses = json.load(f)
        
        with open(os.path.join(APP_DIR, "BlueCarbonCredit.json"), "r") as f:
            bcc_abi = json.load(f)
            
        with open(os.path.join(APP_DIR, "VerifierRegistry.json"), "r") as f:
            vr_abi = json.load(f)

        with open(os.path.join(APP_DIR, "CreditMarketplace.json"), "r") as f:
            cm_abi = json.load(f)

        return addresses, bcc_abi, vr_abi, cm_abi
    except Exception as e:
        print(f"Blockchain metadata files not found: {e}. Blockchain features will run in Mock Mode.")
        return None, None, None, None

addresses, bcc_abi, vr_abi, cm_abi = load_contract_metadata()

def is_blockchain_available() -> bool:
    if settings.MOCK_MODE:
        return False
    if addresses is None:
        return False
    return w3.is_connected()

def get_bcc_contract():
    if not is_blockchain_available():
        return None
    return w3.eth.contract(address=addresses["BlueCarbonCredit"], abi=bcc_abi)

def get_verifier_registry_contract():
    if not is_blockchain_available():
        return None
    return w3.eth.contract(address=addresses["VerifierRegistry"], abi=vr_abi)

def get_marketplace_contract():
    if not is_blockchain_available():
        return None
    return w3.eth.contract(address=addresses["CreditMarketplace"], abi=cm_abi)

def mint_credits_on_chain(project_id: str, recipient_address: str, amount: float, evidence_hash: str) -> str:
    """
    Calls the mint() function on the BlueCarbonCredit smart contract.
    Signed by the backend admin private key.
    """
    if not is_blockchain_available():
        print("Blockchain not available. Generating mock mint tx hash.")
        import uuid
        return f"0xmock{uuid.uuid4().hex}"

    contract = get_bcc_contract()
    if not contract:
        raise Exception("BlueCarbonCredit contract not initialized.")

    # Convert recipient address to checksum address
    recipient_checksum = w3.to_checksum_address(recipient_address)
    
    # BCC uses 18 decimals
    amount_in_wei = w3.to_wei(amount, 'ether')
    
    # Build transaction
    account = w3.eth.account.from_key(settings.ADMIN_PRIVATE_KEY)
    
    nonce = w3.eth.get_transaction_count(account.address)
    
    tx = contract.functions.mint(
        recipient_checksum,
        amount_in_wei,
        project_id,
        evidence_hash
    ).build_transaction({
        'chainId': w3.eth.chain_id,
        'gas': 300000,
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce,
    })
    
    # Sign transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=settings.ADMIN_PRIVATE_KEY)
    
    # Send transaction
    raw_tx = getattr(signed_tx, "raw_transaction", getattr(signed_tx, "rawTransaction", None))
    tx_hash = w3.eth.send_raw_transaction(raw_tx)
    
    # Wait for transaction receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    if receipt['status'] != 1:
        raise Exception("Blockchain mint transaction failed.")
        
    return tx_hash.hex()

def add_verifier_on_chain(verifier_address: str) -> str:
    """
    Adds a verifier to VerifierRegistry.
    Signed by the backend admin private key.
    """
    if not is_blockchain_available():
        print("Blockchain not available. Generating mock verifier registry tx.")
        import uuid
        return f"0xmock{uuid.uuid4().hex}"

    contract = get_verifier_registry_contract()
    if not contract:
        raise Exception("VerifierRegistry contract not initialized.")

    verifier_checksum = w3.to_checksum_address(verifier_address)
    account = w3.eth.account.from_key(settings.ADMIN_PRIVATE_KEY)
    nonce = w3.eth.get_transaction_count(account.address)
    
    tx = contract.functions.addVerifier(verifier_checksum).build_transaction({
        'chainId': w3.eth.chain_id,
        'gas': 150000,
        'gasPrice': w3.eth.gas_price,
        'nonce': nonce,
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=settings.ADMIN_PRIVATE_KEY)
    raw_tx = getattr(signed_tx, "raw_transaction", getattr(signed_tx, "rawTransaction", None))
    tx_hash = w3.eth.send_raw_transaction(raw_tx)
    w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_hash.hex()

def verify_retire_transaction(tx_hash: str) -> dict:
    """
    Verifies a retire transaction on-chain by reading the receipt and events.
    """
    if not is_blockchain_available() or tx_hash.startswith("0xmock"):
        return {"status": "success", "amount": 10.0, "project_id": "mock_id"}

    try:
        receipt = w3.eth.get_transaction_receipt(tx_hash)
        if receipt['status'] != 1:
            return {"status": "failed"}

        contract = get_bcc_contract()
        # Find CreditsRetired logs
        logs = contract.events.CreditsRetired().process_receipt(receipt)
        if logs:
            event_args = logs[0]['args']
            amount_eth = w3.from_wei(event_args['amount'], 'ether')
            return {
                "status": "success",
                "amount": float(amount_eth),
                "project_id": event_args['projectId'],
                "by": event_args['by']
            }
        return {"status": "no_event"}
    except Exception as e:
        print(f"Error verifying retirement transaction: {e}")
        return {"status": "error"}
