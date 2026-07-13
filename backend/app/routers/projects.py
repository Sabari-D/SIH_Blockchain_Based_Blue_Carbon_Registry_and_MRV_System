import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, auth, tasks, pdf_gen, mrv
from app.config import settings

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_owner)
):
    # Save project to DB in 'pending' status (it transitions to 'analyzing' then 'pending' / 'flagged')
    project = models.Project(
        owner_id=current_user.id,
        name=project_in.name,
        ecosystem_type=project_in.ecosystem_type,
        polygon_geojson=json.dumps(project_in.polygon_geojson),
        status="pending"
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Trigger satellite analysis background job
    if settings.MOCK_MODE:
        tasks.run_project_analysis(project.id)
        db.refresh(project)
    else:
        try:
            tasks.analyze_project_satellite_data_task.delay(project.id)
        except Exception as e:
            print(f"Celery/Redis broker unavailable ({e}). Falling back to synchronous analysis.")
            tasks.run_project_analysis(project.id)
            db.refresh(project)

    return project

@router.get("", response_model=List[schemas.ProjectResponse])
def get_projects(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Project)
    if status:
        query = query.filter(models.Project.status == status)
    return query.all()

@router.get("/analytics")
def get_global_analytics(db: Session = Depends(get_db)):
    """
    Computes global totals of verified projects, total credits issued,
    total offsets, and breakdown by ecosystem.
    """
    total_projects = db.query(models.Project).count()
    verified_projects = db.query(models.Project).filter(models.Project.status == "verified").count()
    flagged_projects = db.query(models.Project).filter(models.Project.status == "flagged").count()
    
    # Sum credits from verified projects
    total_credits = 0.0
    mangrove_credits = 0.0
    seagrass_credits = 0.0
    salt_marsh_credits = 0.0
    
    verified_list = db.query(models.Project).filter(models.Project.status == "verified").all()
    for p in verified_list:
        if p.carbon_estimates:
            credits = p.carbon_estimates[0].credits
            total_credits += credits
            if p.ecosystem_type == "mangrove":
                mangrove_credits += credits
            elif p.ecosystem_type == "seagrass":
                seagrass_credits += credits
            elif p.ecosystem_type == "salt_marsh":
                salt_marsh_credits += credits

    # Get total retired credits
    total_retired = 0.0
    retire_txs = db.query(models.BlockchainTransaction).filter(models.BlockchainTransaction.action == "retire").all()
    for tx in retire_txs:
        total_retired += tx.amount

    return {
        "totals": {
            "total_projects": total_projects,
            "verified_projects": verified_projects,
            "flagged_projects": flagged_projects,
            "total_credits_minted": round(total_credits, 2),
            "total_credits_retired": round(total_retired, 2),
            "total_credits_active": round(max(0.0, total_credits - total_retired), 2)
        },
        "ecosystem_breakdown": {
            "mangrove": round(mangrove_credits, 2),
            "seagrass": round(seagrass_credits, 2),
            "salt_marsh": round(salt_marsh_credits, 2)
        }
    }

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.post("/{project_id}/analyze", response_model=schemas.ProjectResponse)
def trigger_analysis(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_owner)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    
    # Wipe old NDVI readings & estimates
    db.query(models.NDVIReading).filter(models.NDVIReading.project_id == project_id).delete()
    db.query(models.CarbonEstimate).filter(models.CarbonEstimate.project_id == project_id).delete()
    db.query(models.EvidencePackage).filter(models.EvidencePackage.project_id == project_id).delete()
    db.commit()

    if settings.MOCK_MODE:
        tasks.run_project_analysis(project.id)
    else:
        try:
            tasks.analyze_project_satellite_data_task.delay(project.id)
        except Exception as e:
            print(f"Celery/Redis broker unavailable ({e}). Running analysis synchronously.")
            tasks.run_project_analysis(project.id)
        
    db.refresh(project)
    return project

@router.get("/{project_id}/certificate")
def download_certificate(project_id: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        
    if project.status != "verified":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Certificates can only be generated for verified projects."
        )

    # Gather data for PDF
    ipfs_hash = project.evidence_packages[0].ipfs_hash if project.evidence_packages else "Unknown"
    mint_tx = db.query(models.BlockchainTransaction)\
                .filter(models.BlockchainTransaction.project_id == project_id, models.BlockchainTransaction.action == "mint")\
                .first()
    tx_hash = mint_tx.tx_hash if mint_tx else "Pending blockchain registry"
    
    verification = project.verifications[0] if project.verifications else None
    decided_at = verification.decided_at if verification else project.created_at
    
    # Get verifier wallet address
    verifier_wallet = "Unknown verifier wallet"
    if verification and verification.verifier:
        verifier_wallet = verification.verifier.wallet_address or "Verifier has no wallet registered"
    
    geojson = json.loads(project.polygon_geojson)
    area_ha = mrv.calculate_polygon_area_hectares(geojson)
    
    credits_amt = project.carbon_estimates[0].credits if project.carbon_estimates else 0.0

    cert_data = {
        "id": project.id,
        "name": project.name,
        "ecosystem_type": project.ecosystem_type,
        "area_ha": area_ha,
        "credits": credits_amt,
        "ipfs_hash": ipfs_hash,
        "tx_hash": tx_hash,
        "verifier_wallet": verifier_wallet,
        "decided_at": decided_at
    }

    pdf_buffer = pdf_gen.generate_certificate_pdf(cert_data)
    
    filename = f"BlueCarbon_Cert_{project.name.replace(' ', '_')}.pdf"
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
