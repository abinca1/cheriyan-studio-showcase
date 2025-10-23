#!/usr/bin/env python3
"""
Script to create an admin user for the Cheriyan Studio Showcase application.
"""

import sys
import os
from getpass import getpass

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.db.base import SessionLocal, engine, Base
from app.models import User, Image, RefreshToken  # Import all models
from app.utils.security import get_password_hash

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def create_admin_user():
    """Create an admin user"""
    db: Session = SessionLocal()
    
    try:
        print("Creating admin user for Cheriyan Studio Showcase")
        print("-" * 50)
        
        # Get user input
        email = input("Enter admin email: ").strip()
        username = input("Enter admin username: ").strip()
        full_name = input("Enter admin full name: ").strip()
        password = getpass("Enter admin password: ")
        confirm_password = getpass("Confirm admin password: ")
        
        # Validate input
        if not email or not username or not password:
            print("Error: Email, username, and password are required!")
            return False
        
        if password != confirm_password:
            print("Error: Passwords do not match!")
            return False
        
        # Check if user already exists
        existing_user = db.query(User).filter(
            (User.email == email) | (User.username == username)
        ).first()
        
        if existing_user:
            print("Error: User with this email or username already exists!")
            return False
        
        # Create admin user
        hashed_password = get_password_hash(password)
        admin_user = User(
            email=email,
            username=username,
            full_name=full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"\nAdmin user created successfully!")
        print(f"ID: {admin_user.id}")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"Full Name: {admin_user.full_name}")
        
        return True
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def main():
    """Main function"""
    print("Cheriyan Studio Showcase - Admin User Creation")
    print("=" * 50)
    
    # Create tables first
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    # Create admin user
    if create_admin_user():
        print("\nAdmin user creation completed successfully!")
    else:
        print("\nAdmin user creation failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
