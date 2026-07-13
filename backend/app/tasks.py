import json
import random
from datetime import datetime, timezone
from celery import Celery
from app.config import settings
from app.database import SessionLocal
from app import models, mrv, ipfs

# Configure Celery using Redis as broker and backend
celery_app = Celery("tasks", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task
def analyze_project_satellite_data_task(project_id: str):
    """
    Background Celery task to analyze a new project proposal.
    """
    return run_project_analysis(project_id)

def run_project_analysis(project_id: str):
    """
    Analysis runner. Executable synchronously or in background.
    """
    db = SessionLocal()
    try:
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if not project:
            print(f"Project {project_id} not found in database.")
            return False
        
        project.status = "analyzing"
        db.commit()
        
        # Parse GeoJSON
        geojson = json.loads(project.polygon_geojson)
        geojson["properties"] = {
            "name": project.name,
            "ecosystem_type": project.ecosystem_type
        }
        
        # Calculate area in hectares
        area_ha = mrv.calculate_polygon_area_hectares(geojson)
        
        # Fetch NDVI time series (Sentinel-2 or Mock)
        readings = mrv.get_satellite_ndvi_time_series(geojson)
        
        # Estimate carbon
        estimates = mrv.estimate_carbon_offset(project.ecosystem_type, area_ha, readings)
        
        # Detect anomalies
        anomaly_flags = mrv.detect_anomalies(project.ecosystem_type, area_ha, readings, estimates)
        
        # Save NDVI readings to DB
        for rd, val in readings:
            db_reading = models.NDVIReading(
                project_id=project_id,
                reading_date=rd,
                ndvi_value=val,
                source="mock" if settings.MOCK_MODE else "satellite"
            )
            db.add(db_reading)
            
        # Save Carbon Estimates to DB
        db_estimate = models.CarbonEstimate(
            project_id=project_id,
            biomass=estimates["biomass"],
            carbon=estimates["carbon"],
            co2=estimates["co2"],
            credits=estimates["credits"]
        )
        db.add(db_estimate)
        
        # Assemble Evidence Package
        evidence_payload = {
            "project_id": project.id,
            "name": project.name,
            "ecosystem_type": project.ecosystem_type,
            "area_ha": area_ha,
            "ndvi_time_series": [{"date": rd.isoformat(), "value": val} for rd, val in readings],
            "carbon_estimates": estimates,
            "anomaly_flags": anomaly_flags,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Upload evidence package to IPFS
        ipfs_hash = ipfs.pin_json_to_ipfs(evidence_payload)
        
        # Save EvidencePackage record
        db_evidence = models.EvidencePackage(
            project_id=project_id,
            ipfs_hash=ipfs_hash
        )
        db.add(db_evidence)
        
        # Update project status. Flag if anomalies detected.
        if anomaly_flags:
            project.status = "flagged"
        else:
            project.status = "pending"
            
        db.commit()
        print(f"Project {project_id} analysis completed. Status: {project.status}, IPFS CID: {ipfs_hash}")
        return True
        
    except Exception as e:
        print(f"Error in project analysis runner: {e}")
        db.rollback()
        project = db.query(models.Project).filter(models.Project.id == project_id).first()
        if project:
            project.status = "failed"
            db.commit()
        return False
    finally:
        db.close()

@celery_app.task
def check_all_projects_for_degradation_task():
    """
    Background job that periodically scans all verified projects,
    calculates latest NDVI, and triggers alert if drop exceeds 20% baseline.
    """
    db = SessionLocal()
    try:
        verified_projects = db.query(models.Project).filter(models.Project.status == "verified").all()
        print(f"Scanning {len(verified_projects)} verified projects for degradation...")
        
        for project in verified_projects:
            geojson = json.loads(project.polygon_geojson)
            geojson["properties"] = {"name": project.name, "ecosystem_type": project.ecosystem_type}
            
            baseline_readings = (
                db.query(models.NDVIReading)
                .filter(models.NDVIReading.project_id == project.id)
                .order_by(models.NDVIReading.reading_date.asc())
                .all()
            )
            
            if not baseline_readings:
                continue
                
            baseline_avg_ndvi = sum(r.ndvi_value for r in baseline_readings) / len(baseline_readings)
            
            # Simulate or fetch current NDVI
            # Force degradation if name contains "degrade" or 5% random chance
            is_degrade_sim = "degrade" in project.name.lower() or random.random() < 0.05
            
            if is_degrade_sim:
                current_ndvi = baseline_avg_ndvi * 0.70 # 30% drop from baseline
            else:
                current_ndvi = baseline_avg_ndvi + random.uniform(-0.04, 0.04)
                
            current_ndvi = max(0.0, min(1.0, current_ndvi))
            
            db_reading = models.NDVIReading(
                project_id=project.id,
                reading_date=datetime.now(timezone.utc),
                ndvi_value=current_ndvi,
                source="degradation_check"
            )
            db.add(db_reading)
            
            # Check drop percentage
            if baseline_avg_ndvi > 0:
                drop_pct = ((baseline_avg_ndvi - current_ndvi) / baseline_avg_ndvi) * 100.0
            else:
                drop_pct = 0.0
                
            if drop_pct >= 20.0:
                # Trigger Degradation Alert
                alert = models.DegradationAlert(
                    project_id=project.id,
                    ndvi_drop_percent=drop_pct
                )
                db.add(alert)
                project.status = "flagged"
                print(f"[DEGRADATION DETECTED] Project '{project.name}' ({project.id}) dropped by {drop_pct:.2f}% from baseline!")
                
        db.commit()
    except Exception as e:
        print(f"Error in degradation check task: {e}")
        db.rollback()
    finally:
        db.close()
