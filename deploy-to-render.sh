#!/bin/bash

# Render deployment helper script

set -e

echo "🚀 Preparing Cheriyan Studio Showcase for Render Deployment"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "RENDER_DEPLOYMENT.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if frontend and backend directories exist
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Frontend or backend directory not found"
    echo "Make sure you have the correct project structure"
    exit 1
fi

echo "✅ Project structure verified"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Render deployment"
else
    echo "✅ Git repository found"
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Prepare for Render deployment"
fi

echo "📋 Deployment Checklist:"
echo "========================"

echo "1. 📁 Project Structure:"
echo "   ✅ Frontend directory: $([ -d "frontend" ] && echo "✓" || echo "✗")"
echo "   ✅ Backend directory: $([ -d "backend" ] && echo "✓" || echo "✗")"
echo "   ✅ Render configs: $([ -f "frontend/render.yaml" ] && [ -f "backend/render.yaml" ] && echo "✓" || echo "✗")"

echo ""
echo "2. 🔧 Configuration Files:"
echo "   ✅ Frontend package.json: $([ -f "frontend/package.json" ] && echo "✓" || echo "✗")"
echo "   ✅ Backend requirements.txt: $([ -f "backend/requirements.txt" ] && echo "✓" || echo "✗")"
echo "   ✅ Backend build script: $([ -f "backend/build.sh" ] && echo "✓" || echo "✗")"

echo ""
echo "3. 📚 Documentation:"
echo "   ✅ Render deployment guide: $([ -f "RENDER_DEPLOYMENT.md" ] && echo "✓" || echo "✗")"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Push your code to GitHub:"
echo "   git remote add origin <your-github-repo-url>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "2. Deploy Backend on Render:"
echo "   - Create new Web Service"
echo "   - Connect GitHub repo"
echo "   - Set root directory to 'backend'"
echo "   - Configure environment variables"
echo ""
echo "3. Deploy Frontend on Render:"
echo "   - Create new Static Site"
echo "   - Connect GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Set VITE_API_URL to your backend URL"
echo ""
echo "4. Read the full guide:"
echo "   📖 RENDER_DEPLOYMENT.md"

echo ""
echo "🔑 Important Environment Variables:"
echo "=================================="
echo "Backend:"
echo "  SECRET_KEY=<generate-secure-key>"
echo "  ALLOWED_HOSTS=<your-frontend-url>"
echo "  ENVIRONMENT=production"
echo ""
echo "Frontend:"
echo "  VITE_API_URL=<your-backend-url>"
echo "  NODE_ENV=production"

echo ""
echo "✅ Your project is ready for Render deployment!"
echo "📖 Follow the detailed guide in RENDER_DEPLOYMENT.md"
