from pydantic_settings import BaseSettings
from pydantic import Field
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Blue Carbon Registry & MRV System"
    DATABASE_URL: str = Field("sqlite:///./blue_carbon.db", env="DATABASE_URL")
    JWT_SECRET: str = Field("supersecretjwtkeyforbluecarbonregistry2026", env="JWT_SECRET")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    REDIS_URL: str = Field("redis://localhost:6379/0", env="REDIS_URL")
    
    # Blockchain settings
    RPC_URL: str = Field("http://localhost:8545", env="RPC_URL")
    # Default private key is Hardhat's Account #0
    ADMIN_PRIVATE_KEY: str = Field("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", env="ADMIN_PRIVATE_KEY")
    
    # External integrations
    PINATA_API_KEY: str = Field("", env="PINATA_API_KEY")
    PINATA_API_SECRET: str = Field("", env="PINATA_API_SECRET")
    
    MOCK_MODE: bool = Field(True, env="MOCK_MODE")
    
    # Mail settings
    SMTP_HOST: str = Field("smtp.resend.com", env="SMTP_HOST")
    SMTP_PORT: int = Field(587, env="SMTP_PORT")
    SMTP_USER: str = Field("resend", env="SMTP_USER")
    SMTP_PASSWORD: str = Field("", env="SMTP_PASSWORD")
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = Field("", env="GOOGLE_CLIENT_ID")
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env")
        extra = "ignore"

settings = Settings()
