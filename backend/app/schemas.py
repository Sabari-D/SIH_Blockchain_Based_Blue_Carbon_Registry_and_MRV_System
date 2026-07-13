from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str = "owner"
    wallet_address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    ecosystem_type: str = Field(..., description="mangrove, seagrass, or salt_marsh")
    polygon_geojson: Dict[str, Any] = Field(..., description="GeoJSON Polygon representation")

class NDVIReadingResponse(BaseModel):
    id: str
    project_id: str
    reading_date: datetime
    ndvi_value: float
    source: str

    class Config:
        from_attributes = True

class CarbonEstimateResponse(BaseModel):
    id: str
    project_id: str
    biomass: float
    carbon: float
    co2: float
    credits: float
    calculated_at: datetime

    class Config:
        from_attributes = True

class EvidencePackageResponse(BaseModel):
    id: str
    project_id: str
    ipfs_hash: str
    created_at: datetime

    class Config:
        from_attributes = True

class VerificationCreate(BaseModel):
    decision: str = Field(..., description="approved or rejected")
    comment: str

class VerificationResponse(BaseModel):
    id: str
    project_id: str
    verifier_id: str
    decision: str
    comment: str
    decided_at: datetime
    verifier: UserResponse

    class Config:
        from_attributes = True

class BlockchainTransactionResponse(BaseModel):
    id: str
    project_id: str
    tx_hash: str
    action: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True

class DegradationAlertResponse(BaseModel):
    id: str
    project_id: str
    triggered_at: datetime
    ndvi_drop_percent: float
    resolved: bool

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    ecosystem_type: str
    polygon_geojson: str
    status: str
    created_at: datetime
    owner: UserResponse
    ndvi_readings: List[NDVIReadingResponse] = []
    carbon_estimates: List[CarbonEstimateResponse] = []
    evidence_packages: List[EvidencePackageResponse] = []
    verifications: List[VerificationResponse] = []
    blockchain_transactions: List[BlockchainTransactionResponse] = []
    degradation_alerts: List[DegradationAlertResponse] = []

    class Config:
        from_attributes = True

class MarketplaceListingCreate(BaseModel):
    amount: float
    price_per_credit: float = Field(..., description="Price in Wei per 1.0 BCC")

class MarketplaceListingResponse(BaseModel):
    id: int
    seller: str
    amount: float
    price_per_credit: float
    active: bool

class RetireRequest(BaseModel):
    project_id: str
    amount: float
