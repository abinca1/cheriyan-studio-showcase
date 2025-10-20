#!/usr/bin/env python3
"""
Database migration script for new features:
1. Add is_profile_picture field to images table
2. Create business_hours table
3. Create contact_details table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_database():
    """Run database migrations"""
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
    )
    
    with engine.connect() as conn:
        try:
            # Add is_profile_picture column to images table
            print("Adding is_profile_picture column to images table...")
            conn.execute(text("""
                ALTER TABLE images ADD COLUMN is_profile_picture BOOLEAN DEFAULT FALSE
            """))
            print("✓ Added is_profile_picture column to images table")
            
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "column already exists" in str(e).lower():
                print("✓ is_profile_picture column already exists in images table")
            else:
                print(f"Warning: Could not add is_profile_picture column: {e}")
        
        try:
            # Create business_hours table
            print("Creating business_hours table...")
            conn.execute(text("""
                CREATE TABLE business_hours (
                    id INTEGER PRIMARY KEY,
                    day_of_week VARCHAR NOT NULL UNIQUE,
                    is_open BOOLEAN DEFAULT TRUE,
                    open_time VARCHAR,
                    close_time VARCHAR,
                    is_by_appointment BOOLEAN DEFAULT FALSE,
                    notes VARCHAR,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME
                )
            """))
            print("✓ Created business_hours table")
            
        except Exception as e:
            if "already exists" in str(e).lower() or "table already exists" in str(e).lower():
                print("✓ business_hours table already exists")
            else:
                print(f"Warning: Could not create business_hours table: {e}")
        
        try:
            # Create contact_details table
            print("Creating contact_details table...")
            conn.execute(text("""
                CREATE TABLE contact_details (
                    id INTEGER PRIMARY KEY,
                    email VARCHAR NOT NULL,
                    phone VARCHAR NOT NULL,
                    address VARCHAR NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME
                )
            """))
            print("✓ Created contact_details table")
            
        except Exception as e:
            if "already exists" in str(e).lower() or "table already exists" in str(e).lower():
                print("✓ contact_details table already exists")
            else:
                print(f"Warning: Could not create contact_details table: {e}")
        
        conn.commit()
        print("\n✅ Database migration completed successfully!")
        
        # Initialize business hours with default values
        print("\nInitializing business hours with default values...")
        from init_business_hours import init_business_hours
        init_business_hours()

if __name__ == "__main__":
    migrate_database()
