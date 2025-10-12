#!/usr/bin/env python3
"""
Production startup script for Cheriyan Studio Showcase API
"""

import uvicorn
import os
import sys
from app.core.config import settings

def initialize_database():
    """Initialize database on startup if needed"""
    try:
        print("🔧 Checking database initialization...")

        # Import here to avoid circular imports
        from sqlalchemy import create_engine, text
        from app.db.base import Base

        engine = create_engine(settings.DATABASE_URL)

        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables verified")

        # Check if admin user exists
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM users WHERE is_admin = true"))
            admin_count = result.scalar()

            if admin_count == 0:
                print("🔧 Creating admin user...")
                try:
                    from init_db import run_script
                    run_script("create_admin", "Creating admin user")
                    run_script("add_images", "Adding sample images")
                    run_script("fix_categories", "Fixing image categories")
                    run_script("add_social_media", "Setting up social media links")
                except Exception as e:
                    print(f"⚠️  Database initialization warning: {e}")
                    print("📝 You may need to create admin user manually")
            else:
                print("✅ Admin user exists")

    except Exception as e:
        print(f"⚠️  Database initialization error: {e}")
        print("📝 Application will start but may need manual database setup")

if __name__ == "__main__":
    # Initialize database on startup
    initialize_database()

    # Render uses PORT environment variable
    port = int(os.environ.get("PORT", settings.PORT))

    print(f"🚀 Starting Cheriyan Studio API on port {port}")

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=port,
        reload=not settings.is_production,
        workers=1,  # Render free tier works better with 1 worker
        log_level="debug" if settings.DEBUG else "info",
        access_log=True,
    )
