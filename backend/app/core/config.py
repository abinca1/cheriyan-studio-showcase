import os
from typing import List

try:
    # Try Pydantic v2 first (newer versions)
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        # Fallback to Pydantic v1
        from pydantic import BaseSettings
    except ImportError:
        # Last resort - create a basic settings class
        class BaseSettings:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cheriyan Studio Showcase"
    VERSION: str = os.getenv("APP_VERSION", "1.0.0")

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cheriyan_studio.db")

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # CORS
    ALLOW_CORS: bool = os.getenv("ALLOW_CORS", "true").lower() == "true"

    @property
    def ALLOWED_HOSTS(self) -> List[str]:
        """Get allowed hosts from environment variable"""
        hosts_str = os.getenv(
            "ALLOWED_HOSTS",
            "http://localhost:3000,http://localhost:5173,http://localhost:8081,http://127.0.0.1:3000,http://127.0.0.1:8081,http://10.252.103.200:8081/,https://cheriyan-studio-frontend.onrender.com"
        )
        return [host.strip() for host in hosts_str.split(",")]

    # File Upload
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "app/static/images")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(10 * 1024 * 1024)))  # 10MB

    @property
    def ALLOWED_EXTENSIONS(self) -> List[str]:
        """Get allowed file extensions from environment variable"""
        extensions_str = os.getenv("ALLOWED_EXTENSIONS", ".jpg,.jpeg,.png,.gif,.webp")
        return [ext.strip() for ext in extensions_str.split(",")]

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.lower() == "production"

    @property
    def cors_origins(self) -> List[str]:
        if self.is_production:
            return [host.strip() for host in self.ALLOWED_HOSTS if host.strip()]
        else:
            return ["*"]

    class Config:
        env_file = ".env"

settings = Settings()
