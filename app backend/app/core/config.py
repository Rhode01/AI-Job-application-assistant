from typing import Any, List
from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, validator, HttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = ""
    VERSION: str = ""
   
    
    # Database
    POSTGRES_HOST: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"
    
    SQLALCHEMY_DATABASE_URI: PostgresDsn | None = None

    # Auth0 Configuration
    AUTH0_DOMAIN: str
    AUTH0_CLIENT_ID: str
    AUTH0_CLIENT_SECRET: str
    AUTH0_API_AUDIENCE: str
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
