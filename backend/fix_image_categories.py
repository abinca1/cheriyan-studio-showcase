#!/usr/bin/env python3
"""
Script to fix existing images by populating the category field based on category_id
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Use the database URL from settings
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fix_image_categories():
    """Update existing images to populate category field from category_id"""
    db = SessionLocal()
    
    try:
        # Get all images with category_id but no category name
        result = db.execute(text("""
            UPDATE images 
            SET category = (
                SELECT categories.name 
                FROM categories 
                WHERE categories.id = images.category_id
            )
            WHERE images.category_id IS NOT NULL 
            AND (images.category IS NULL OR images.category = '')
        """))
        
        db.commit()
        
        print(f"✅ Updated {result.rowcount} images with category names")
        
        # Show the updated images
        result = db.execute(text("""
            SELECT id, title, category, category_id 
            FROM images 
            WHERE category_id IS NOT NULL
        """))
        
        print("\n📋 Updated images:")
        for row in result.fetchall():
            print(f"  ID: {row[0]}, Title: {row[1]}, Category: {row[2]}, Category ID: {row[3]}")
        
    except Exception as e:
        print(f"❌ Error updating image categories: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🔧 Fixing image categories...")
    print("=" * 50)
    
    fix_image_categories()
    
    print("\n🎉 Image category fix complete!")

if __name__ == "__main__":
    main()
