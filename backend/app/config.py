import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SolanaCPIBoard API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://cpi_admin:cpi_secure_password_123@localhost:5432/solanacpiboard"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Rate Limiting
    RATE_LIMIT_PUBLIC: str = os.getenv("RATE_LIMIT_PUBLIC", "60/minute")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://solanacpiboard.xyz",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
