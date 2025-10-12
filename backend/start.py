#!/usr/bin/env python3
"""
Production startup script for Cheriyan Studio Showcase API
"""

import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=not settings.is_production,
        workers=1 if settings.DEBUG else 4,
        log_level="debug" if settings.DEBUG else "info",
        access_log=True,
    )
