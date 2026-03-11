# from fastapi import FastAPI
# from web3 import Web3
# import json
# import os
# from dotenv import load_dotenv
# import mysql.connector
# from ndvi_service import get_ndvi
# from reportlab.pdfgen import canvas

# load_dotenv()

# app = FastAPI()

# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="2207@S",
#     database="blue_carbon_mrv"
# )

# cursor = db.cursor()

# RPC_URL = os.getenv("RPC_URL")

# w3 = Web3(Web3.HTTPProvider(RPC_URL))

# BLOCKCHAIN_ENABLED = w3.is_connected()

# with open("contract_abi.json") as f:
#     abi = json.load(f)

# CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# contract = None
# account = None

# if BLOCKCHAIN_ENABLED and CONTRACT_ADDRESS and PRIVATE_KEY:

#     contract = w3.eth.contract(
#         address=Web3.to_checksum_address(CONTRACT_ADDRESS),
#         abi=abi
#     )

#     account = w3.eth.account.from_key(PRIVATE_KEY)


# def mint_credits(project_id, credits):

#     if not BLOCKCHAIN_ENABLED or contract is None:
#         return "SIMULATED_TX_" + project_id

#     try:

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             int(credits),
#             project_id
#         ).build_transaction({
#             "chainId": 80002,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("30", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return tx_hash.hex()

#     except Exception:
#         return "BLOCKCHAIN_FAILED_" + project_id


# def save_project(project_id, lat, lon, ndvi, co2, credits, tx):

#     query = """
#     INSERT INTO carbon_projects
#     (project_id, latitude, longitude, ndvi, co2, credits, tx_hash, status)
#     VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
#     """

#     values = (
#         project_id,
#         lat,
#         lon,
#         ndvi,
#         co2,
#         credits,
#         tx,
#         "PENDING"
#     )

#     cursor.execute(query, values)
#     db.commit()


# @app.get("/")
# def home():
#     return {"message": "Blue Carbon MRV Backend Running"}


# @app.post("/estimate-carbon")
# def estimate_carbon(project_id: str, latitude: float, longitude: float):

#     ndvi = get_ndvi(latitude, longitude)

#     biomass = ndvi * 100
#     carbon = biomass * 0.47
#     co2 = carbon * 3.67

#     credits = round(co2)

#     tx_hash = mint_credits(project_id, credits)

#     save_project(project_id, latitude, longitude, ndvi, co2, credits, tx_hash)

#     return {
#         "project_id": project_id,
#         "latitude": latitude,
#         "longitude": longitude,
#         "ndvi": ndvi,
#         "estimated_co2": co2,
#         "credits_minted": credits,
#         "tx_hash": tx_hash
#     }


# @app.get("/projects")
# def get_projects():

#     cursor.execute("SELECT * FROM carbon_projects ORDER BY timestamp DESC")

#     rows = cursor.fetchall()

#     projects = []

#     for r in rows:

#         projects.append({
#             "id": r[0],
#             "project_id": r[1],
#             "latitude": r[2],
#             "longitude": r[3],
#             "ndvi": r[4],
#             "co2": r[5],
#             "credits": r[6],
#             "tx_hash": r[7],
#             "status": r[8],
#             "timestamp": r[9]
#         })

#     return projects


# @app.post("/verify-project")
# def verify_project(project_id: str):

#     cursor.execute(
#         "UPDATE carbon_projects SET status='VERIFIED' WHERE project_id=%s",
#         (project_id,)
#     )

#     db.commit()

#     return {
#         "message": "Project verified",
#         "project_id": project_id
#     }


# @app.get("/generate-certificate")
# def generate_certificate(project_id: str):

#     cursor.execute(
#         "SELECT * FROM carbon_projects WHERE project_id=%s",
#         (project_id,)
#     )

#     p = cursor.fetchone()

#     if not p:
#         return {"error": "Project not found"}

#     filename = f"{project_id}_certificate.pdf"

#     c = canvas.Canvas(filename)

#     c.setFont("Helvetica", 16)
#     c.drawString(100,750,"Blue Carbon Credit Certificate")

#     c.setFont("Helvetica", 12)

#     c.drawString(100,700,f"Project ID: {p[1]}")
#     c.drawString(100,670,f"Latitude: {p[2]}")
#     c.drawString(100,640,f"Longitude: {p[3]}")
#     c.drawString(100,610,f"NDVI: {p[4]}")
#     c.drawString(100,580,f"CO2 Offset: {p[5]} tons")
#     c.drawString(100,550,f"Credits Issued: {p[6]}")

#     c.drawString(100,520,"Blockchain Transaction:")
#     c.drawString(100,500,f"{p[7]}")

#     c.drawString(100,450,"Issued By: Blue Carbon MRV Registry")

#     c.save()

#     return {"certificate": filename}








# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from web3 import Web3
# import json
# import os
# from dotenv import load_dotenv
# import mysql.connector
# from ndvi_service import get_ndvi

# load_dotenv()

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="2207@S",
#     database="blue_carbon_mrv"
# )

# cursor = db.cursor()

# RPC_URL = os.getenv("RPC_URL")

# w3 = Web3(Web3.HTTPProvider(RPC_URL))

# BLOCKCHAIN_ENABLED = w3.is_connected()

# with open("contract_abi.json") as f:
#     abi = json.load(f)

# CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# contract = None
# account = None

# if BLOCKCHAIN_ENABLED and CONTRACT_ADDRESS and PRIVATE_KEY:

#     contract = w3.eth.contract(
#         address=Web3.to_checksum_address(CONTRACT_ADDRESS),
#         abi=abi
#     )

#     account = w3.eth.account.from_key(PRIVATE_KEY)


# def mint_credits(project_id, credits):

#     if not BLOCKCHAIN_ENABLED or contract is None:
#         return "SIMULATED_TX_" + project_id

#     try:

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             int(credits),
#             project_id
#         ).build_transaction({
#             "chainId": 80002,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("30", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return tx_hash.hex()

#     except Exception:
#         return "BLOCKCHAIN_FAILED_" + project_id


# def save_project(project_id, lat, lon, ndvi, co2, credits, tx):

#     query = """
#     INSERT INTO carbon_projects
#     (project_id, latitude, longitude, ndvi, co2, credits, tx_hash)
#     VALUES (%s,%s,%s,%s,%s,%s,%s)
#     """

#     values = (
#         project_id,
#         lat,
#         lon,
#         ndvi,
#         co2,
#         credits,
#         tx
#     )

#     cursor.execute(query, values)
#     db.commit()


# @app.get("/")
# def home():
#     return {"message": "Blue Carbon MRV Backend Running"}


# @app.post("/estimate-carbon")
# def estimate_carbon(project_id: str, latitude: float, longitude: float):

#     ndvi = get_ndvi(latitude, longitude)

#     biomass = ndvi * 100
#     carbon = biomass * 0.47
#     co2 = carbon * 3.67

#     credits = round(co2)

#     tx_hash = mint_credits(project_id, credits)

#     save_project(project_id, latitude, longitude, ndvi, co2, credits, tx_hash)

#     return {
#         "project_id": project_id,
#         "latitude": latitude,
#         "longitude": longitude,
#         "ndvi": ndvi,
#         "co2": co2,
#         "credits": credits,
#         "tx_hash": tx_hash
#     }


# @app.get("/projects")
# def get_projects():

#     cursor.execute("SELECT * FROM carbon_projects ORDER BY id DESC")

#     rows = cursor.fetchall()

#     projects = []

#     for r in rows:

#         projects.append({
#             "id": r[0],
#             "project_id": r[1],
#             "latitude": r[2],
#             "longitude": r[3],
#             "ndvi": r[4],
#             "co2": r[5],
#             "credits": r[6],
#             "tx_hash": r[7]
#         })

#     return projects









# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from web3 import Web3
# import json
# import os
# from dotenv import load_dotenv
# import mysql.connector
# from ndvi_service import get_ndvi

# load_dotenv()

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="2207@S",
#     database="blue_carbon_mrv"
# )

# cursor = db.cursor()

# RPC_URL = os.getenv("RPC_URL")

# w3 = Web3(Web3.HTTPProvider(RPC_URL))

# BLOCKCHAIN_ENABLED = w3.is_connected()

# with open("contract_abi.json") as f:
#     abi = json.load(f)

# CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# contract = None
# account = None

# if BLOCKCHAIN_ENABLED and CONTRACT_ADDRESS and PRIVATE_KEY:

#     contract = w3.eth.contract(
#         address=Web3.to_checksum_address(CONTRACT_ADDRESS),
#         abi=abi
#     )

#     account = w3.eth.account.from_key(PRIVATE_KEY)


# def mint_credits(project_id, credits):

#     if not BLOCKCHAIN_ENABLED or contract is None:
#         return "SIMULATED_TX_" + project_id

#     try:

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             int(credits),
#             project_id
#         ).build_transaction({
#             "chainId": 80002,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("30", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return tx_hash.hex()

#     except Exception:
#         return "BLOCKCHAIN_FAILED_" + project_id


# def save_project(project_id, lat, lon, ndvi, co2, credits, tx):

#     query = """
#     INSERT INTO carbon_projects
#     (project_id, latitude, longitude, ndvi, co2, credits, tx_hash)
#     VALUES (%s,%s,%s,%s,%s,%s,%s)
#     """

#     values = (
#         project_id,
#         lat,
#         lon,
#         ndvi,
#         co2,
#         credits,
#         tx
#     )

#     cursor.execute(query, values)
#     db.commit()


# @app.get("/")
# def home():
#     return {"message": "Blue Carbon MRV Backend Running"}


# @app.post("/estimate-carbon")
# def estimate_carbon(project_id: str, latitude: float, longitude: float):

#     ndvi = get_ndvi(latitude, longitude)

#     biomass = ndvi * 100
#     carbon = biomass * 0.47
#     co2 = carbon * 3.67

#     credits = round(co2)

#     tx_hash = mint_credits(project_id, credits)

#     save_project(project_id, latitude, longitude, ndvi, co2, credits, tx_hash)

#     return {
#         "project_id": project_id,
#         "latitude": latitude,
#         "longitude": longitude,
#         "ndvi": ndvi,
#         "co2": co2,
#         "credits": credits,
#         "tx_hash": tx_hash
#     }


# @app.get("/projects")
# def get_projects():

#     cursor.execute("SELECT * FROM carbon_projects ORDER BY id DESC")

#     rows = cursor.fetchall()

#     projects = []

#     for r in rows:

#         projects.append({
#             "id": r[0],
#             "project_id": r[1],
#             "latitude": r[2],
#             "longitude": r[3],
#             "ndvi": r[4],
#             "co2": r[5],
#             "credits": r[6],
#             "tx_hash": r[7]
#         })

#     return projects


# @app.get("/analytics")
# def analytics():

#     cursor.execute("SELECT COUNT(*) FROM carbon_projects")
#     total_projects = cursor.fetchone()[0]

#     cursor.execute("SELECT SUM(co2) FROM carbon_projects")
#     total_co2 = cursor.fetchone()[0] or 0

#     cursor.execute("SELECT SUM(credits) FROM carbon_projects")
#     total_credits = cursor.fetchone()[0] or 0

#     return {
#         "total_projects": total_projects,
#         "total_co2_offset": total_co2,
#         "total_credits": total_credits
#     }










# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from web3 import Web3
# import mysql.connector
# import json
# import os
# from dotenv import load_dotenv
# from ndvi_service import get_ndvi

# load_dotenv()

# app = FastAPI()

# # -----------------------------
# # CORS
# # -----------------------------

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -----------------------------
# # DATABASE CONNECTION
# # -----------------------------

# def get_db_connection():

#     return mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="2207@S",
#         database="blue_carbon_mrv",
#         autocommit=True
#     )


# # -----------------------------
# # BLOCKCHAIN SETUP
# # -----------------------------

# RPC_URL = os.getenv("RPC_URL")

# w3 = Web3(Web3.HTTPProvider(RPC_URL))

# BLOCKCHAIN_ENABLED = w3.is_connected()

# with open("contract_abi.json") as f:
#     abi = json.load(f)

# CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
# PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# contract = None
# account = None

# if BLOCKCHAIN_ENABLED and CONTRACT_ADDRESS and PRIVATE_KEY:

#     contract = w3.eth.contract(
#         address=Web3.to_checksum_address(CONTRACT_ADDRESS),
#         abi=abi
#     )

#     account = w3.eth.account.from_key(PRIVATE_KEY)


# # -----------------------------
# # BLOCKCHAIN MINT FUNCTION
# # -----------------------------

# def mint_credits(project_id, credits):

#     if not BLOCKCHAIN_ENABLED or contract is None:
#         return "SIMULATED_TX_" + project_id

#     try:

#         nonce = w3.eth.get_transaction_count(account.address)

#         tx = contract.functions.mint(
#             account.address,
#             int(credits),
#             project_id
#         ).build_transaction({
#             "chainId": 80002,
#             "gas": 2000000,
#             "gasPrice": w3.to_wei("30", "gwei"),
#             "nonce": nonce
#         })

#         signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

#         tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

#         return tx_hash.hex()

#     except Exception as e:

#         print("Blockchain error:", e)

#         return "BLOCKCHAIN_FAILED_" + project_id


# # -----------------------------
# # SAVE PROJECT
# # -----------------------------

# def save_project(project_id, lat, lon, ndvi, co2, credits, tx):

#     db = get_db_connection()

#     cursor = db.cursor()

#     query = """
#     INSERT INTO carbon_projects
#     (project_id, latitude, longitude, ndvi, co2, credits, tx_hash)
#     VALUES (%s,%s,%s,%s,%s,%s,%s)
#     """

#     values = (
#         project_id,
#         lat,
#         lon,
#         ndvi,
#         co2,
#         credits,
#         tx
#     )

#     cursor.execute(query, values)

#     cursor.close()
#     db.close()


# # -----------------------------
# # ROOT
# # -----------------------------

# @app.get("/")
# def home():

#     return {"message": "Blue Carbon MRV Backend Running"}


# # -----------------------------
# # CARBON ESTIMATION
# # -----------------------------

# @app.post("/estimate-carbon")
# def estimate_carbon(project_id: str, latitude: float, longitude: float):

#     ndvi = get_ndvi(latitude, longitude)

#     biomass = ndvi * 100

#     carbon = biomass * 0.47

#     co2 = carbon * 3.67

#     credits = round(co2)

#     tx_hash = mint_credits(project_id, credits)

#     save_project(
#         project_id,
#         latitude,
#         longitude,
#         ndvi,
#         co2,
#         credits,
#         tx_hash
#     )

#     return {
#         "project_id": project_id,
#         "latitude": latitude,
#         "longitude": longitude,
#         "ndvi": ndvi,
#         "co2": co2,
#         "credits": credits,
#         "tx_hash": tx_hash
#     }


# # -----------------------------
# # GET PROJECTS
# # -----------------------------

# @app.get("/projects")
# def get_projects():

#     db = get_db_connection()

#     cursor = db.cursor()

#     cursor.execute("SELECT * FROM carbon_projects ORDER BY id DESC")

#     rows = cursor.fetchall()

#     projects = []

#     for r in rows:

#         projects.append({

#             "id": r[0],
#             "project_id": r[1],
#             "latitude": r[2],
#             "longitude": r[3],
#             "ndvi": r[4],
#             "co2": r[5],
#             "credits": r[6],
#             "tx_hash": r[7]

#         })

#     cursor.close()
#     db.close()

#     return projects


# # -----------------------------
# # ANALYTICS API
# # -----------------------------

# @app.get("/analytics")
# def analytics():

#     db = get_db_connection()

#     cursor = db.cursor()

#     cursor.execute("SELECT COUNT(*) FROM carbon_projects")
#     total_projects = cursor.fetchone()[0]

#     cursor.execute("SELECT SUM(co2) FROM carbon_projects")
#     total_co2 = cursor.fetchone()[0] or 0

#     cursor.execute("SELECT SUM(credits) FROM carbon_projects")
#     total_credits = cursor.fetchone()[0] or 0

#     cursor.close()
#     db.close()

#     return {
#         "total_projects": total_projects,
#         "total_co2_offset": total_co2,
#         "total_credits": total_credits
#     }











from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from web3 import Web3
import mysql.connector
import json
import os
from dotenv import load_dotenv
from ndvi_service import get_ndvi
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

load_dotenv()

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# DATABASE CONNECTION
# -----------------------------

def get_db_connection():

    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="2207@S",
        database="blue_carbon_mrv",
        autocommit=True
    )

# -----------------------------
# BLOCKCHAIN SETUP
# -----------------------------

RPC_URL = os.getenv("RPC_URL")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

BLOCKCHAIN_ENABLED = w3.is_connected()

with open("contract_abi.json") as f:
    abi = json.load(f)

CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

contract = None
account = None

if BLOCKCHAIN_ENABLED and CONTRACT_ADDRESS and PRIVATE_KEY:

    contract = w3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=abi
    )

    account = w3.eth.account.from_key(PRIVATE_KEY)

# -----------------------------
# BLOCKCHAIN MINT FUNCTION
# -----------------------------

def mint_credits(project_id, credits):

    if not BLOCKCHAIN_ENABLED or contract is None:
        return "SIMULATED_TX_" + project_id

    try:

        nonce = w3.eth.get_transaction_count(account.address)

        tx = contract.functions.mint(
            account.address,
            int(credits),
            project_id
        ).build_transaction({
            "chainId": 80002,
            "gas": 2000000,
            "gasPrice": w3.to_wei("30", "gwei"),
            "nonce": nonce
        })

        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)

        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        return tx_hash.hex()

    except Exception as e:

        print("Blockchain error:", e)

        return "BLOCKCHAIN_FAILED_" + project_id

# -----------------------------
# SAVE PROJECT
# -----------------------------

def save_project(project_id, lat, lon, ndvi, co2, credits, tx):

    db = get_db_connection()
    cursor = db.cursor()

    query = """
    INSERT INTO carbon_projects
    (project_id, latitude, longitude, ndvi, co2, credits, tx_hash)
    VALUES (%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        project_id,
        lat,
        lon,
        ndvi,
        co2,
        credits,
        tx
    )

    cursor.execute(query, values)

    cursor.close()
    db.close()

# -----------------------------
# ROOT
# -----------------------------

@app.get("/")
def home():
    return {"message": "Blue Carbon MRV Backend Running"}

# -----------------------------
# CARBON ESTIMATION
# -----------------------------

@app.post("/estimate-carbon")
def estimate_carbon(project_id: str, latitude: float, longitude: float):

    ndvi = get_ndvi(latitude, longitude)

    biomass = ndvi * 100
    carbon = biomass * 0.47
    co2 = carbon * 3.67
    credits = round(co2)

    tx_hash = mint_credits(project_id, credits)

    save_project(
        project_id,
        latitude,
        longitude,
        ndvi,
        co2,
        credits,
        tx_hash
    )

    return {
        "project_id": project_id,
        "latitude": latitude,
        "longitude": longitude,
        "ndvi": ndvi,
        "co2": co2,
        "credits": credits,
        "tx_hash": tx_hash
    }

# -----------------------------
# GET PROJECTS
# -----------------------------

@app.get("/projects")
def get_projects():

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM carbon_projects ORDER BY id DESC")

    rows = cursor.fetchall()

    projects = []

    for r in rows:

        projects.append({
            "id": r[0],
            "project_id": r[1],
            "latitude": r[2],
            "longitude": r[3],
            "ndvi": r[4],
            "co2": r[5],
            "credits": r[6],
            "tx_hash": r[7]
        })

    cursor.close()
    db.close()

    return projects

# -----------------------------
# ANALYTICS API
# -----------------------------

@app.get("/analytics")
def analytics():

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("SELECT COUNT(*) FROM carbon_projects")
    total_projects = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(co2) FROM carbon_projects")
    total_co2 = cursor.fetchone()[0] or 0

    cursor.execute("SELECT SUM(credits) FROM carbon_projects")
    total_credits = cursor.fetchone()[0] or 0

    cursor.close()
    db.close()

    return {
        "total_projects": total_projects,
        "total_co2_offset": total_co2,
        "total_credits": total_credits
    }

# -----------------------------
# CERTIFICATE GENERATION
# -----------------------------

@app.get("/certificate/{project_id}")
def generate_certificate(project_id: str):

    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT project_id, latitude, longitude, ndvi, co2, credits, tx_hash FROM carbon_projects WHERE project_id=%s",
        (project_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    db.close()

    if not row:
        return {"error": "Project not found"}

    file_name = f"{project_id}_certificate.pdf"

    c = canvas.Canvas(file_name, pagesize=letter)

    c.setFont("Helvetica-Bold", 22)
    c.drawString(120, 700, "Carbon Offset Certificate")

    c.setFont("Helvetica", 14)

    c.drawString(100, 650, f"Project ID: {row[0]}")
    c.drawString(100, 620, f"Latitude: {row[1]}")
    c.drawString(100, 590, f"Longitude: {row[2]}")
    c.drawString(100, 560, f"NDVI: {row[3]}")
    c.drawString(100, 530, f"CO2 Offset: {row[4]}")
    c.drawString(100, 500, f"Credits Issued: {row[5]}")
    c.drawString(100, 470, f"Blockchain TX: {row[6]}")

    c.drawString(100, 420, "Verified on Polygon Blockchain")

    c.save()

    return FileResponse(file_name, media_type="application/pdf", filename=file_name)