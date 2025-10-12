#!/bin/bash

# Render build script for backend

set -e

echo "🔧 Installing Python dependencies..."
pip install -r requirements.txt

echo "🗄️  Setting up database..."
python create_tables.py

echo "👤 Creating admin user..."
python create_admin_simple.py

echo "📸 Adding sample images..."
python add_sample_images.py

echo "🔧 Fixing image categories..."
python fix_image_categories.py

echo "📱 Adding social media links..."
python add_social_media_table.py

echo "✅ Backend build completed successfully!"
