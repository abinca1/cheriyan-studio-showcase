#!/usr/bin/env python3
"""
Database migration script to add new columns to existing tables
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate_database():
    """Add new columns to existing tables"""
    engine = create_engine(settings.DATABASE_URL)
    
    print("Starting database migration...")
    
    with engine.connect() as connection:
        try:
            # Check if columns already exist
            result = connection.execute(text("PRAGMA table_info(images)"))
            columns = [row[1] for row in result.fetchall()]
            
            # Add is_hero_image column if it doesn't exist
            if 'is_hero_image' not in columns:
                print("Adding is_hero_image column to images table...")
                connection.execute(text("ALTER TABLE images ADD COLUMN is_hero_image BOOLEAN DEFAULT 0"))
                connection.commit()
                print("✅ Added is_hero_image column")
            else:
                print("✅ is_hero_image column already exists")
            
            # Add category_id column if it doesn't exist
            if 'category_id' not in columns:
                print("Adding category_id column to images table...")
                connection.execute(text("ALTER TABLE images ADD COLUMN category_id INTEGER"))
                connection.commit()
                print("✅ Added category_id column")
            else:
                print("✅ category_id column already exists")
                
            print("Database migration completed successfully!")
            
        except Exception as e:
            print(f"Error during migration: {e}")
            connection.rollback()
            raise

if __name__ == "__main__":
    migrate_database()
