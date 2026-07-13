from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth, blockchain

router = APIRouter(tags=["Marketplace & Retirement"])

# In-memory mock listings for fallback when blockchain is offline
MOCK_LISTINGS = [
    {
        "id": 101,
        "seller": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "amount": 25.0,
        "price_per_credit": 100000000000000000, # 0.1 ETH in Wei
        "active": True
    },
    {
        "id": 102,
        "seller": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "amount": 50.0,
        "price_per_credit": 80000000000000000, # 0.08 ETH in Wei
        "active": True
    }
]

@router.get("/marketplace/listings", response_model=List[schemas.MarketplaceListingResponse])
def get_listings():
    """
    Fetches active listings. Attempts to read directly from the CreditMarketplace contract.
    Falls back to mock listings if the blockchain is not connected.
    """
    if blockchain.is_blockchain_available():
        contract = blockchain.get_marketplace_contract()
        if contract:
            try:
                listings = []
                next_id = contract.functions.nextListingId().call()
                for i in range(1, next_id):
                    lst = contract.functions.listings(i).call()
                    # lst format: [id, seller, amount, pricePerCredit, active]
                    if lst[4]: # if active
                        listings.append({
                            "id": lst[0],
                            "seller": lst[1],
                            "amount": float(blockchain.w3.from_wei(lst[2], 'ether')),
                            "price_per_credit": float(lst[3]),
                            "active": lst[4]
                        })
                return listings
            except Exception as e:
                print(f"Error reading from marketplace contract: {e}. Using mock listings.")
    
    return [l for l in MOCK_LISTINGS if l["active"]]

@router.post("/marketplace/listings/mock-buy/{listing_id}")
def mock_buy_listing(listing_id: int):
    """
    Mock endpoint to buy credits when Metamask is not connected.
    Simulates buying by marking the mock listing inactive.
    """
    for l in MOCK_LISTINGS:
        if l["id"] == listing_id:
            if not l["active"]:
                raise HTTPException(status_code=400, detail="Listing already sold")
            l["active"] = False
            return {"status": "success", "message": f"Successfully purchased listing {listing_id} (mock)"}
            
    raise HTTPException(status_code=404, detail="Listing not found")

@router.post("/credits/retire", response_model=schemas.BlockchainTransactionResponse)
def retire_credits(
    request: schemas.RetireRequest,
    tx_hash: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Burns credits and issues a public retirement record.
    If tx_hash is provided, it verifies the burn on-chain first.
    If not, it simulates it (useful for quick local tests or wallet-less flow).
    """
    project = db.query(models.Project).filter(models.Project.id == request.project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if tx_hash:
        # Verify the transaction details on-chain
        verification = blockchain.verify_retire_transaction(tx_hash)
        if verification["status"] != "success":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to verify retirement transaction on-chain: {verification['status']}"
            )
        amount = verification["amount"]
    else:
        # Mock mode retirement: generate mock transaction hash
        amount = request.amount
        tx_hash = f"0xmockretire{uuid.uuid4().hex}"

    # Record blockchain transaction
    db_tx = models.BlockchainTransaction(
        project_id=project.id,
        tx_hash=tx_hash,
        action="retire",
        amount=amount
    )
    db.add(db_tx)
    
    # Mark the project's record as retired in db
    project.status = "verified" # remains verified, but has retired transactions attached
    db.commit()
    db.refresh(db_tx)
    
    print(f"Retired {amount} credits for project {project.name}. Tx: {tx_hash}")
    return db_tx
