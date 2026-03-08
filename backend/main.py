# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from web3 import Web3
# import json
# import os
# from dotenv import load_dotenv
# from ndvi_service import get_ndvi

# load_dotenv()

# # ------------------------------------------------
# # FastAPI App
# # ------------------------------------------------
# app = FastAPI()

# # ------------------------------------------------
# # Enable CORS (Required for React frontend)
# # ------------------------------------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow React frontend
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ------------------------------------------------
# # Load Environment Variables
# # ------------------------------------------------
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")
# RPC_URL = os.getenv("RPC_URL")
# CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# # ------------------------------------------------
# # Connect to Blockchain
# # ------------------------------------------------
# w3 = Web3(Web3.HTTPProvider(RPC_URL))

# if not w3.is_connected():
#     raise Exception("❌ Failed to connect to blockchain")

# # ------------------------------------------------
# # Load Contract ABI
# # ------------------------------------------------
# with open("contract_abi.json") as f:
#     abi = json.load(f)

# # ------------------------------------------------
# # Initialize Contract
# # ------------------------------------------------
# contract = w3.eth.contract(
#     address=Web3.to_checksum_address(CONTRACT_ADDRESS),
#     abi=abi
# )

# # ------------------------------------------------
# # Load Wallet Account
# # ------------------------------------------------
# account = w3.eth.account.from_key(PRIVATE_KEY)


# # ------------------------------------------------
# # Home Route
# # ------------------------------------------------
# @app.get("/")
# def home():
#     return {"message": "Blue Carbon MRV Backend Running"}


# # ------------------------------------------------
# # Manual Mint (Testing)
# # ------------------------------------------------
# @app.post("/mint")
# def mint_credits(project_id: str, amount: int):

#     try:

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             amount,
#             project_id
#         ).build_transaction({
#             "chainId": 31337,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("20", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return {
#             "status": "success",
#             "project_id": project_id,
#             "credits_minted": amount,
#             "tx_hash": tx_hash.hex()
#         }

#     except Exception as e:

#         return {
#             "status": "error",
#             "message": str(e)
#         }


# # ------------------------------------------------
# # Area Based Carbon Estimation + Mint
# # ------------------------------------------------
# @app.post("/estimate-and-mint")
# def estimate_and_mint(project_id: str, area_hectares: float):

#     try:

#         biomass_factor = 10
#         carbon_fraction = 0.47
#         co2_conversion = 3.67

#         biomass = area_hectares * biomass_factor
#         carbon = biomass * carbon_fraction
#         co2 = carbon * co2_conversion

#         credits = round(co2)

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             credits,
#             project_id
#         ).build_transaction({
#             "chainId": 31337,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("20", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return {
#             "status": "success",
#             "project_id": project_id,
#             "area_hectares": area_hectares,
#             "estimated_biomass": biomass,
#             "estimated_carbon": carbon,
#             "estimated_co2": co2,
#             "credits_minted": credits,
#             "tx_hash": tx_hash.hex()
#         }

#     except Exception as e:

#         return {
#             "status": "error",
#             "message": str(e)
#         }


# # ------------------------------------------------
# # NDVI Satellite Carbon Estimation + Mint
# # ------------------------------------------------
# @app.post("/ndvi-estimate")
# def ndvi_estimate(project_id: str, latitude: float, longitude: float):

#     try:

#         # Get NDVI from satellite
#         ndvi = get_ndvi(latitude, longitude)

#         # Carbon estimation
#         biomass = ndvi * 100
#         carbon = biomass * 0.47
#         co2 = carbon * 3.67
#         credits = round(co2)

#         # Blockchain mint
#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             credits,
#             project_id
#         ).build_transaction({
#             "chainId": 31337,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("20", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return {
#             "status": "success",
#             "project_id": project_id,
#             "latitude": latitude,
#             "longitude": longitude,
#             "ndvi": ndvi,
#             "estimated_biomass": biomass,
#             "estimated_carbon": carbon,
#             "estimated_co2": co2,
#             "credits_minted": credits,
#             "tx_hash": "0x" + tx_hash.hex()
#         }

#     except Exception as e:
#         return {"error": str(e)}






from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from web3 import Web3
import json
import os
from dotenv import load_dotenv
from ndvi_service import get_ndvi

load_dotenv()

# ------------------------------------------------
# FastAPI App
# ------------------------------------------------
app = FastAPI()

# ------------------------------------------------
# Enable CORS
# ------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------
# Environment Variables
# ------------------------------------------------
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# ------------------------------------------------
# Blockchain Connection
# ------------------------------------------------
w3 = Web3(Web3.HTTPProvider(RPC_URL))

if not w3.is_connected():
    raise Exception("❌ Failed to connect to blockchain")

# ------------------------------------------------
# Load Contract ABI
# ------------------------------------------------
with open("contract_abi.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=abi
)

# ------------------------------------------------
# Wallet Account
# ------------------------------------------------
account = w3.eth.account.from_key(PRIVATE_KEY)

# ------------------------------------------------
# Helper: Safe Credit Conversion
# ------------------------------------------------
def safe_credit(value):
    """
    Convert any float to safe positive integer credits
    """
    if value is None:
        return 1

    credits = int(abs(value))

    if credits <= 0:
        credits = 1

    return credits

# ------------------------------------------------
# Home Route
# ------------------------------------------------
@app.get("/")
def home():
    return {"message": "Blue Carbon MRV Backend Running"}

# ------------------------------------------------
# Manual Mint
# ------------------------------------------------
@app.post("/mint")
def mint_credits(project_id: str, amount: int):

    try:

        credits = safe_credit(amount)

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.mint(
            account.address,
            credits,
            project_id
        ).build_transaction({
            "chainId": 31337,
            "gas": 2000000,
            "gasPrice": w3.to_wei("20", "gwei"),
            "nonce": nonce
        })

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return {
            "status": "success",
            "project_id": project_id,
            "credits_minted": credits,
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {"error": str(e)}

# ------------------------------------------------
# Area Based Estimation
# ------------------------------------------------
@app.post("/estimate-and-mint")
def estimate_and_mint(project_id: str, area_hectares: float):

    try:

        biomass_factor = 10
        carbon_fraction = 0.47
        co2_conversion = 3.67

        biomass = area_hectares * biomass_factor
        carbon = biomass * carbon_fraction
        co2 = carbon * co2_conversion

        credits = safe_credit(co2)

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.mint(
            account.address,
            credits,
            project_id
        ).build_transaction({
            "chainId": 31337,
            "gas": 2000000,
            "gasPrice": w3.to_wei("20", "gwei"),
            "nonce": nonce
        })

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return {
            "status": "success",
            "project_id": project_id,
            "area_hectares": area_hectares,
            "estimated_biomass": biomass,
            "estimated_carbon": carbon,
            "estimated_co2": co2,
            "credits_minted": credits,
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {"error": str(e)}

# ------------------------------------------------
# NDVI Satellite Estimation
# ------------------------------------------------
@app.post("/ndvi-estimate")
def ndvi_estimate(project_id: str, latitude: float, longitude: float):

    try:

        # Get NDVI from satellite
        ndvi = get_ndvi(latitude, longitude)

        # Carbon estimation
        biomass = ndvi * 100
        carbon = biomass * 0.47
        co2 = carbon * 3.67

        credits = safe_credit(co2)

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.mint(
            account.address,
            credits,
            project_id
        ).build_transaction({
            "chainId": 31337,
            "gas": 2000000,
            "gasPrice": w3.to_wei("20", "gwei"),
            "nonce": nonce
        })

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return {
            "status": "success",
            "project_id": project_id,
            "latitude": latitude,
            "longitude": longitude,
            "ndvi": ndvi,
            "estimated_biomass": biomass,
            "estimated_carbon": carbon,
            "estimated_co2": co2,
            "credits_minted": credits,
            "tx_hash": tx_hash.hex()
        }

    except Exception as e:
        return {"error": str(e)}