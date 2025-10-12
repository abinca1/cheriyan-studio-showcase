#!/usr/bin/env python3
"""
Simple script to create an admin user
"""

import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.base import SessionLocal, engine, Base
from app.models import User, Image, RefreshToken
import bcrypt

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def create_admin_user():
    """Create an admin user"""
    db: Session = SessionLocal()
    
    try:
        # Create admin user
        password = "admin123"  # Simple password
        # Hash password directly with bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        admin_user = User(
            email="admin@cheriyanstudio.com",
            username="admin",
            full_name="Cheriyan Studio Admin",
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"Password: admin123")
        
        return True
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def main():
    """Main function"""
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    print("Creating admin user...")
    if create_admin_user():
        print("Admin user creation completed successfully!")
    else:
        print("Admin user creation failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
