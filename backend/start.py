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
        from sqlalchemy import create_engine, text, inspect
        from app.db.base import Base

        engine = create_engine(settings.DATABASE_URL)

        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")

        # Verify tables exist
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"📋 Available tables: {tables}")

        # Check if users table exists and has admin user
        if 'users' in tables:
            with engine.connect() as conn:
                try:
                    result = conn.execute(text("SELECT COUNT(*) FROM users WHERE is_admin = true"))
                    admin_count = result.scalar()

                    if admin_count == 0:
                        print("🔧 No admin user found, creating one...")
                        # Create admin user directly
                        from app.utils.security import get_password_hash
                        hashed_password = get_password_hash("admin123")

                        conn.execute(text("""
                            INSERT INTO users (username, email, hashed_password, is_admin, created_at, updated_at)
                            VALUES ('admin', 'admin@cheriyanstudio.com', :password, true, datetime('now'), datetime('now'))
                        """), {"password": hashed_password})
                        conn.commit()
                        print("✅ Admin user created (username: admin, password: admin123)")
                    else:
                        print("✅ Admin user exists")
                except Exception as e:
                    print(f"⚠️  Admin user check failed: {e}")
        else:
            print("⚠️  Users table not found")

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
