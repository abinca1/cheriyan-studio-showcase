#!/bin/bash

# Production build script for Cheriyan Studio Showcase

set -e

echo "🚀 Building Cheriyan Studio Showcase for Production"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm ci --only=production

echo "🏗️  Building frontend for production..."
npm run build

echo "🐍 Setting up Python virtual environment..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

echo "📦 Installing Python dependencies..."
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

cd ..

echo "✅ Build completed successfully!"
echo ""
echo "🚀 To start the production server:"
echo "   cd backend && source venv/bin/activate && python start.py"
echo ""
echo "🐳 To run with Docker:"
echo "   docker-compose up -d"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update .env.production with your production settings"
echo "   2. Change the SECRET_KEY in production"
echo "   3. Update ALLOWED_HOSTS with your domain"
echo "   4. Set up SSL certificates for HTTPS"
