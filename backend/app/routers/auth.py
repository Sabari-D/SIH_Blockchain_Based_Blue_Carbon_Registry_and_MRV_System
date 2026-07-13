from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from app.database import get_db
from app import models, schemas, auth, blockchain
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user email is taken
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed_password = auth.get_password_hash(user_in.password)
    user = models.User(
        email=user_in.email,
        password_hash=hashed_password,
        role=user_in.role,
        wallet_address=user_in.wallet_address
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If the user registers as a verifier and provides a wallet address, add them on-chain
    if user.role == "verifier" and user.wallet_address:
        try:
            print(f"Registering verifier address {user.wallet_address} on-chain...")
            blockchain.add_verifier_on_chain(user.wallet_address)
        except Exception as e:
            print(f"Warning: Could not register verifier on-chain: {e}")

    return user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
        
    access_token_expires = timedelta(minutes=auth.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

class GoogleLoginRequest(BaseModel):
    token: str

@router.post("/google", response_model=schemas.Token)
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        # If the token is not a JWT (doesn't start with "eyJ"), it is an access token
        if not payload.token.startswith("eyJ"):
            import requests as httprequests
            resp = httprequests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {payload.token}"}
            )
            if not resp.ok:
                raise Exception("Failed to fetch userinfo from Google API")
            id_info = resp.json()
        else:
            # Verify the ID token with Google
            id_info = id_token.verify_oauth2_token(
                payload.token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
        
        email = id_info['email']
        
        # Check if user already exists
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if not user:
            # Create user in database if they don't exist
            user = models.User(
                email=email,
                password_hash="google_oauth_user_no_password",
                role="owner",  # Default role is owner
                wallet_address=""  # Can be added by user profile later
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        access_token_expires = timedelta(minutes=auth.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email, "role": user.role},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Google OAuth Exception: {e}", flush=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Google token: {e}"
        )

