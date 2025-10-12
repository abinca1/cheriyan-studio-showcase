#!/usr/bin/env python3
"""
Script to add social media table and default social media links
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.social_media import SocialMedia

# Use the correct database file
DATABASE_URL = "sqlite:///./cheriyan_studio.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_social_media_table():
    """Create the social media table"""
    with engine.connect() as connection:
        # Check if table already exists
        result = connection.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='social_media'"))
        if result.fetchone():
            print("✅ Social media table already exists")
            return
        
        # Create the table
        connection.execute(text("""
            CREATE TABLE social_media (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform VARCHAR NOT NULL,
                url VARCHAR NOT NULL,
                icon_name VARCHAR NOT NULL,
                display_name VARCHAR NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                sort_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME
            )
        """))
        connection.commit()
        print("✅ Created social media table")

def add_default_social_media():
    """Add default social media links"""
    db = SessionLocal()
    
    try:
        # Check if any social media links already exist
        existing = db.query(SocialMedia).first()
        if existing:
            print("⚠️  Social media links already exist")
            return
        
        # Default social media links
        default_links = [
            {
                "platform": "whatsapp",
                "url": "https://wa.me/1234567890",
                "icon_name": "MessageCircle",
                "display_name": "WhatsApp",
                "is_active": True,
                "sort_order": 1
            },
            {
                "platform": "instagram",
                "url": "https://instagram.com/cheriyan_photography",
                "icon_name": "Instagram",
                "display_name": "Instagram",
                "is_active": True,
                "sort_order": 2
            },
            {
                "platform": "facebook",
                "url": "https://facebook.com/cheriyan.photography",
                "icon_name": "Facebook",
                "display_name": "Facebook",
                "is_active": True,
                "sort_order": 3
            }
        ]
        
        # Add default links
        for link_data in default_links:
            social_media = SocialMedia(**link_data)
            db.add(social_media)
        
        db.commit()
        print(f"✅ Added {len(default_links)} default social media links")
        
    except Exception as e:
        print(f"❌ Error adding default social media links: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🚀 Setting up social media functionality...")
    print("=" * 50)
    
    # Create table
    create_social_media_table()
    
    # Add default data
    add_default_social_media()
    
    print("\n🎉 Social media setup complete!")
    print("\nDefault social media links added:")
    print("- WhatsApp: https://wa.me/1234567890")
    print("- Instagram: https://instagram.com/cheriyan_photography")
    print("- Facebook: https://facebook.com/cheriyan.photography")
    print("\nYou can edit these links from the admin dashboard.")

if __name__ == "__main__":
    main()
