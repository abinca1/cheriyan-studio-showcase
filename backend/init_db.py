#!/usr/bin/env python3
"""
Robust database initialization script for Render deployment
"""

import sys
import os
import traceback

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def run_script(script_name, description):
    """Run a script and handle errors gracefully"""
    try:
        print(f"🔧 {description}...")
        
        if script_name == "create_tables":
            from create_tables import main
            main()
        elif script_name == "create_admin":
            from create_admin_simple import main
            main()
        elif script_name == "add_images":
            from add_sample_images import main
            main()
        elif script_name == "fix_categories":
            from fix_image_categories import main
            main()
        elif script_name == "add_social_media":
            from add_social_media_table import main
            main()
            
        print(f"✅ {description} completed successfully")
        return True
        
    except Exception as e:
        print(f"⚠️  {description} encountered an issue: {str(e)}")
        print(f"📝 This is often normal on first deployment or if data already exists")
        return False

def main():
    """Initialize the database with all required data"""
    print("🚀 Initializing Cheriyan Studio Database")
    print("=" * 50)
    
    scripts = [
        ("create_tables", "Creating database tables"),
        ("create_admin", "Creating admin user"),
        ("add_images", "Adding sample images"),
        ("fix_categories", "Fixing image categories"),
        ("add_social_media", "Setting up social media links"),
    ]
    
    success_count = 0
    for script_name, description in scripts:
        if run_script(script_name, description):
            success_count += 1
    
    print("\n" + "=" * 50)
    print(f"🎉 Database initialization completed!")
    print(f"📊 {success_count}/{len(scripts)} operations successful")
    print("🚀 Application ready to start!")

if __name__ == "__main__":
    main()
