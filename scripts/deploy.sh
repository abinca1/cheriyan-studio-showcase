#!/bin/bash

# Deployment script for Cheriyan Studio Showcase

set -e

echo "🚀 Deploying Cheriyan Studio Showcase"
echo "====================================="

# Check if environment is specified
if [ -z "$1" ]; then
    echo "❌ Please specify environment: ./deploy.sh [development|production]"
    exit 1
fi

ENVIRONMENT=$1

echo "🌍 Deploying to: $ENVIRONMENT"

# Copy appropriate environment file
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -f "backend/.env.production" ]; then
        cp backend/.env.production backend/.env
        echo "✅ Using production environment configuration"
    else
        echo "❌ Production environment file not found. Please create backend/.env.production"
        exit 1
    fi
elif [ "$ENVIRONMENT" = "development" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "✅ Using development environment configuration"
    else
        echo "❌ Development environment file not found."
        exit 1
    fi
else
    echo "❌ Invalid environment. Use 'development' or 'production'"
    exit 1
fi

# Build the project
echo "🏗️  Building project..."
./scripts/build.sh

# Start services based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🐳 Starting production services with Docker..."
    docker-compose --profile production up -d
    
    echo "⏳ Waiting for services to start..."
    sleep 10
    
    echo "🔍 Checking service health..."
    if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
        echo "✅ Backend is healthy"
    else
        echo "❌ Backend health check failed"
        docker-compose logs app
        exit 1
    fi
    
    if curl -f http://localhost > /dev/null 2>&1; then
        echo "✅ Frontend is accessible"
    else
        echo "❌ Frontend health check failed"
        docker-compose logs nginx
        exit 1
    fi
    
    echo "🎉 Production deployment successful!"
    echo "📱 Frontend: http://localhost"
    echo "🔧 API: http://localhost/api"
    echo "📚 API Docs: http://localhost/docs"
    
else
    echo "🔧 Starting development services..."
    cd backend
    source venv/bin/activate
    
    echo "🚀 Starting backend server..."
    python start.py &
    BACKEND_PID=$!
    
    cd ..
    echo "🎨 Starting frontend server..."
    npm run dev &
    FRONTEND_PID=$!
    
    echo "✅ Development servers started!"
    echo "📱 Frontend: http://localhost:8081"
    echo "🔧 API: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop servers"
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
fi
