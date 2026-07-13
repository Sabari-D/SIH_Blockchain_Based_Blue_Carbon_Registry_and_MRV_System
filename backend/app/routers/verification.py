from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from eth_account import Account
from app.database import get_db
from app import models, schemas, auth, blockchain

router = APIRouter(prefix="/verification", tags=["Verification"])

@router.get("/queue", response_model=List[schemas.ProjectResponse])
def get_verification_queue(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_verifier)
):
    """
    Returns pending and flagged projects awaiting review.
    Sorted with 'flagged' (potential anomalies) first to prioritize critical reviews.
    """
    flagged = db.query(models.Project).filter(models.Project.status == "flagged").all()
    pending = db.query(models.Project).filter(models.Project.status == "pending").all()
    
    # Return flagged projects followed by pending projects
    return flagged + pending

@router.post("/{project_id}/approve", response_model=schemas.ProjectResponse)
def approve_project(
    project_id: str,
    verification_in: schemas.VerificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_verifier)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.status not in ["pending", "flagged"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project cannot be approved from status: {project.status}"
        )

    # 1. Update status
    project.status = "verified"
    
    # 2. Record verification decision
    verification = models.Verification(
        project_id=project.id,
        verifier_id=current_user.id,
        decision="approved",
        comment=verification_in.comment
    )
    db.add(verification)

    # 3. Call Smart Contract to Mint Credits
    # Fetch credit amount and IPFS hash
    if not project.carbon_estimates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No carbon estimates computed for this project. Cannot mint."
        )
    if not project.evidence_packages:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No IPFS evidence package compiled for this project. Cannot mint."
        )

    credits_to_mint = project.carbon_estimates[0].credits
    evidence_hash = project.evidence_packages[0].ipfs_hash
    
    # Fallback to Admin's address if owner didn't link their web3 wallet
    recipient_wallet = project.owner.wallet_address
    if not recipient_wallet:
        admin_wallet = Account.from_key(auth.settings.ADMIN_PRIVATE_KEY).address
        recipient_wallet = admin_wallet
        print(f"Project owner has no wallet. Defaulting minting target to admin: {recipient_wallet}")

    try:
        print(f"Minting {credits_to_mint} BCC credits to wallet: {recipient_wallet}...")
        tx_hash = blockchain.mint_credits_on_chain(
            project_id=project.id,
            recipient_address=recipient_wallet,
            amount=credits_to_mint,
            evidence_hash=evidence_hash
        )
        
        # 4. Save transaction log
        db_tx = models.BlockchainTransaction(
            project_id=project.id,
            tx_hash=tx_hash,
            action="mint",
            amount=credits_to_mint
        )
        db.add(db_tx)
        
    except Exception as e:
        print(f"Smart contract mint call failed: {e}")
        # Rollback status update and raise error
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"On-chain minting failed: {str(e)}. Verification aborted."
        )

    db.commit()
    db.refresh(project)
    return project

@router.post("/{project_id}/reject", response_model=schemas.ProjectResponse)
def reject_project(
    project_id: str,
    verification_in: schemas.VerificationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_verifier)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    if project.status not in ["pending", "flagged"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project cannot be rejected from status: {project.status}"
        )

    project.status = "rejected"
    
    verification = models.Verification(
        project_id=project.id,
        verifier_id=current_user.id,
        decision="rejected",
        comment=verification_in.comment
    )
    db.add(verification)
    
    db.commit()
    db.refresh(project)
    return project
