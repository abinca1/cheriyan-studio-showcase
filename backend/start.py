#!/usr/bin/env python3
"""
Production startup script for Cheriyan Studio Showcase API
"""

import uvicorn
import os
from app.core.config import settings

if __name__ == "__main__":
    # Render uses PORT environment variable
    port = int(os.environ.get("PORT", settings.PORT))

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=port,
        reload=not settings.is_production,
        workers=1 if settings.DEBUG else 1,  # Render free tier works better with 1 worker
        log_level="debug" if settings.DEBUG else "info",
        access_log=True,
    )
