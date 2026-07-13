from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.config import settings
from app import models, auth, blockchain
from app.routers import auth as auth_router, projects as projects_router, verification as verification_router, marketplace as marketplace_router

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Decentralized Registry & MRV System for Blue Carbon Credit Issuance",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router.router)
app.include_router(projects_router.router)
app.include_router(verification_router.router)
app.include_router(marketplace_router.router)

@app.on_event("startup")
def seed_initial_users():
    """
    Seeds initial role-based accounts so the system is immediately usable.
    Uses default Hardhat node account addresses for Web3 demonstration.
    """
    db = SessionLocal()
    try:
        # Seed Admin
        admin_email = "admin@registry.org"
        admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin:
            db_admin = models.User(
                email=admin_email,
                password_hash=auth.get_password_hash("adminpass"),
                role="admin",
                wallet_address="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" # Hardhat Account #0
            )
            db.add(db_admin)
            print(f"Seeded Admin account: {admin_email}")

        # Seed Verifier
        verifier_email = "verifier@registry.org"
        verifier = db.query(models.User).filter(models.User.email == verifier_email).first()
        if not verifier:
            db_verifier = models.User(
                email=verifier_email,
                password_hash=auth.get_password_hash("verifierpass"),
                role="verifier",
                wallet_address="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" # Hardhat Account #1
            )
            db.add(db_verifier)
            print(f"Seeded Verifier account: {verifier_email}")

        # Seed Project Owner
        owner_email = "owner@registry.org"
        owner = db.query(models.User).filter(models.User.email == owner_email).first()
        if not owner:
            db_owner = models.User(
                email=owner_email,
                password_hash=auth.get_password_hash("ownerpass"),
                role="owner",
                wallet_address="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" # Hardhat Account #2
            )
            db.add(db_owner)
            print(f"Seeded Project Owner account: {owner_email}")

        db.commit()
    except Exception as e:
        print(f"Error seeding initial accounts: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "blockchain_connected": blockchain.is_blockchain_available()
    }
