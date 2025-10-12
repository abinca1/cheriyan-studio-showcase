#!/usr/bin/env python3
"""
Database migration script to create new tables for enhanced admin dashboard
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from app.core.config import settings
from app.db.base import Base
from app.models import User, Image, RefreshToken, Category, Testimonial, HeroSlide

def create_tables():
    """Create all tables in the database"""
    engine = create_engine(settings.DATABASE_URL)
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    
    # Create default categories
    from sqlalchemy.orm import sessionmaker
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if categories already exist
        existing_categories = db.query(Category).count()
        if existing_categories == 0:
            print("Creating default categories...")
            default_categories = [
                {"name": "Portrait", "slug": "portrait", "description": "Portrait photography", "sort_order": 1},
                {"name": "Wedding", "slug": "wedding", "description": "Wedding photography", "sort_order": 2},
                {"name": "Event", "slug": "event", "description": "Event photography", "sort_order": 3},
                {"name": "Nature", "slug": "nature", "description": "Nature and landscape photography", "sort_order": 4},
                {"name": "Commercial", "slug": "commercial", "description": "Commercial photography", "sort_order": 5},
                {"name": "Hero", "slug": "hero", "description": "Hero section images", "sort_order": 6},
            ]
            
            for cat_data in default_categories:
                category = Category(**cat_data)
                db.add(category)
            
            db.commit()
            print("Default categories created!")
        else:
            print("Categories already exist, skipping creation.")
            
    except Exception as e:
        print(f"Error creating default categories: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
