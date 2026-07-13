import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="owner")  # owner, verifier, admin
    wallet_address = Column(String(255), nullable=True)

    projects = relationship("Project", back_populates="owner")
    verifications = relationship("Verification", back_populates="verifier")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    owner_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    ecosystem_type = Column(String(50), nullable=False)  # mangrove, seagrass, salt_marsh
    polygon_geojson = Column(Text, nullable=False)  # Store GeoJSON polygon area representation
    status = Column(String(50), default="pending")  # pending, analyzing, verified, rejected, flagged
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="projects")
    ndvi_readings = relationship("NDVIReading", back_populates="project", cascade="all, delete-orphan")
    carbon_estimates = relationship("CarbonEstimate", back_populates="project", cascade="all, delete-orphan")
    evidence_packages = relationship("EvidencePackage", back_populates="project", cascade="all, delete-orphan")
    verifications = relationship("Verification", back_populates="project", cascade="all, delete-orphan")
    blockchain_transactions = relationship("BlockchainTransaction", back_populates="project", cascade="all, delete-orphan")
    degradation_alerts = relationship("DegradationAlert", back_populates="project", cascade="all, delete-orphan")


class NDVIReading(Base):
    __tablename__ = "ndvi_readings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    reading_date = Column(DateTime, nullable=False)
    ndvi_value = Column(Float, nullable=False)
    source = Column(String(50), default="mock")  # satellite, mock

    project = relationship("Project", back_populates="ndvi_readings")


class CarbonEstimate(Base):
    __tablename__ = "carbon_estimates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    biomass = Column(Float, nullable=False)
    carbon = Column(Float, nullable=False)
    co2 = Column(Float, nullable=False)
    credits = Column(Float, nullable=False)
    calculated_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="carbon_estimates")


class EvidencePackage(Base):
    __tablename__ = "evidence_packages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    ipfs_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="evidence_packages")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    verifier_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False)  # approved, rejected
    comment = Column(Text, nullable=False)
    decided_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="verifications")
    verifier = relationship("User", back_populates="verifications")


class BlockchainTransaction(Base):
    __tablename__ = "blockchain_transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    tx_hash = Column(String(255), nullable=False)
    action = Column(String(50), nullable=False)  # mint, retire
    amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="blockchain_transactions")


class DegradationAlert(Base):
    __tablename__ = "degradation_alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    triggered_at = Column(DateTime, default=datetime.utcnow)
    ndvi_drop_percent = Column(Float, nullable=False)
    resolved = Column(Boolean, default=False)

    project = relationship("Project", back_populates="degradation_alerts")
