#!/usr/bin/env python3
"""
Script to add sample images from assets folder to the database
"""

import os
import shutil
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.image import Image
from app.models.category import Category
from app.core.config import settings

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def copy_assets_to_static():
    """Copy images from frontend assets to backend static folder"""
    assets_path = "../src/assets"
    static_path = "app/static/images"
    
    # Create static directory if it doesn't exist
    os.makedirs(static_path, exist_ok=True)
    
    # List of asset images to copy
    asset_images = [
        "hero-slideshow-1.jpg",
        "hero-slideshow-2.jpg", 
        "hero-slideshow-3.jpg",
        "hero-slideshow-4.jpg",
        "gallery-fashion-1.jpg",
        "gallery-wedding-1.jpg",
        "gallery-portrait-1.jpg",
        "gallery-product-1.jpg",
        "hero-image.jpg",
        "photographer-portrait.jpg"
    ]
    
    copied_files = []
    for image_file in asset_images:
        src_path = os.path.join(assets_path, image_file)
        dst_path = os.path.join(static_path, image_file)
        
        if os.path.exists(src_path):
            shutil.copy2(src_path, dst_path)
            copied_files.append(image_file)
            print(f"✅ Copied {image_file}")
        else:
            print(f"❌ File not found: {src_path}")
    
    return copied_files

def add_images_to_database(copied_files):
    """Add copied images to the database"""
    db = SessionLocal()
    
    try:
        # Get categories
        portrait_cat = db.query(Category).filter(Category.slug == "portrait").first()
        wedding_cat = db.query(Category).filter(Category.slug == "wedding").first()
        commercial_cat = db.query(Category).filter(Category.slug == "commercial").first()
        hero_cat = db.query(Category).filter(Category.slug == "hero").first()
        
        # Define image data
        image_data = [
            {
                "filename": "hero-slideshow-1.jpg",
                "title": "Hero Slideshow 1",
                "description": "Beautiful landscape photography for hero section",
                "category_id": hero_cat.id if hero_cat else 6,
                "is_hero_image": True
            },
            {
                "filename": "hero-slideshow-2.jpg", 
                "title": "Hero Slideshow 2",
                "description": "Stunning portrait photography for hero section",
                "category_id": hero_cat.id if hero_cat else 6,
                "is_hero_image": True
            },
            {
                "filename": "hero-slideshow-3.jpg",
                "title": "Hero Slideshow 3", 
                "description": "Professional wedding photography for hero section",
                "category_id": hero_cat.id if hero_cat else 6,
                "is_hero_image": True
            },
            {
                "filename": "hero-slideshow-4.jpg",
                "title": "Hero Slideshow 4",
                "description": "Creative commercial photography for hero section", 
                "category_id": hero_cat.id if hero_cat else 6,
                "is_hero_image": True
            },
            {
                "filename": "gallery-fashion-1.jpg",
                "title": "Fashion Editorial 1",
                "description": "High-fashion editorial photography",
                "category_id": commercial_cat.id if commercial_cat else 5,
                "is_hero_image": False
            },
            {
                "filename": "gallery-wedding-1.jpg",
                "title": "Wedding Moment 1", 
                "description": "Beautiful wedding ceremony capture",
                "category_id": wedding_cat.id if wedding_cat else 2,
                "is_hero_image": False
            },
            {
                "filename": "gallery-portrait-1.jpg",
                "title": "Portrait Session 1",
                "description": "Professional portrait photography",
                "category_id": portrait_cat.id if portrait_cat else 1,
                "is_hero_image": False
            },
            {
                "filename": "gallery-product-1.jpg",
                "title": "Product Photography 1",
                "description": "Commercial product photography",
                "category_id": commercial_cat.id if commercial_cat else 5,
                "is_hero_image": False
            },
            {
                "filename": "hero-image.jpg",
                "title": "Main Hero Image",
                "description": "Primary hero section background image",
                "category_id": hero_cat.id if hero_cat else 6,
                "is_hero_image": True
            },
            {
                "filename": "photographer-portrait.jpg",
                "title": "Photographer Portrait",
                "description": "Professional portrait of the photographer",
                "category_id": portrait_cat.id if portrait_cat else 1,
                "is_hero_image": False
            }
        ]
        
        # Add images that were successfully copied
        added_count = 0
        for img_data in image_data:
            if img_data["filename"] in copied_files:
                # Check if image already exists
                existing = db.query(Image).filter(Image.filename == img_data["filename"]).first()
                if not existing:
                    new_image = Image(
                        filename=img_data["filename"],
                        title=img_data["title"],
                        description=img_data["description"],
                        file_path=f"app/static/images/{img_data['filename']}",
                        file_size=os.path.getsize(f"app/static/images/{img_data['filename']}"),
                        mime_type="image/jpeg",
                        category_id=img_data["category_id"],
                        is_hero_image=img_data["is_hero_image"],
                        owner_id=1,  # Admin user
                        is_featured=img_data["is_hero_image"],  # Hero images are featured
                        is_public=True
                    )
                    db.add(new_image)
                    added_count += 1
                    print(f"✅ Added to database: {img_data['title']}")
                else:
                    print(f"⚠️  Already exists: {img_data['title']}")
        
        db.commit()
        print(f"\n🎉 Successfully added {added_count} images to the database!")
        
    except Exception as e:
        print(f"❌ Error adding images to database: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🚀 Adding sample images to database...")
    print("=" * 50)
    
    # Copy files from assets to static
    print("\n📁 Copying files from assets to static folder...")
    copied_files = copy_assets_to_static()
    
    if copied_files:
        print(f"\n📊 Successfully copied {len(copied_files)} files")
        
        # Add to database
        print("\n💾 Adding images to database...")
        add_images_to_database(copied_files)
    else:
        print("❌ No files were copied. Please check the assets folder path.")

if __name__ == "__main__":
    main()
