# 🚀 Cheriyan Studio Showcase - Production Deployment Guide

This guide covers deploying the Cheriyan Studio Showcase application to production.

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ and pip
- **Docker** and Docker Compose (for containerized deployment)
- **Domain name** and SSL certificates (for production)

## 🏗️ Quick Start

### Development Deployment
```bash
# Clone the repository
git clone <repository-url>
cd cheriyan-studio-showcase

# Deploy in development mode
./scripts/deploy.sh development
```

### Production Deployment
```bash
# Deploy in production mode
./scripts/deploy.sh production
```

## 🔧 Manual Setup

### 1. Environment Configuration

Copy and customize the environment files:

```bash
# For development
cp backend/.env.example backend/.env

# For production
cp backend/.env.production backend/.env
```

**Important Production Settings:**
- `SECRET_KEY`: Generate a secure random string (32+ characters)
- `ALLOWED_HOSTS`: Set to your production domain(s)
- `DATABASE_URL`: Use PostgreSQL/MySQL for production
- `ENVIRONMENT=production`
- `DEBUG=false`

### 2. Frontend Build

```bash
# Install dependencies
npm ci --only=production

# Build for production
npm run build
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python create_tables.py
python create_admin_simple.py
python add_sample_images.py
python fix_image_categories.py
python add_social_media_table.py
```

### 4. Start Production Server

```bash
# Start with Python
python start.py

# Or with Docker
docker-compose up -d
```

## 🐳 Docker Deployment

### Single Container
```bash
# Build and run
docker build -t cheriyan-studio .
docker run -p 8000:8000 -v ./uploads:/app/app/static/images cheriyan-studio
```

### Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# With nginx (production)
docker-compose --profile production up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Nginx Configuration

For production, use the included `nginx.conf`:

### Features:
- **Static file serving** with caching
- **API proxying** with rate limiting
- **Security headers**
- **Gzip compression**
- **SSL/HTTPS support** (uncomment SSL section)

### SSL Setup:
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `./ssl/` directory
3. Uncomment HTTPS server block in `nginx.conf`
4. Update server_name with your domain

## 🔒 Security Checklist

### Backend Security:
- [ ] Change `SECRET_KEY` to a secure random string
- [ ] Set `DEBUG=false` in production
- [ ] Use HTTPS in production
- [ ] Restrict `ALLOWED_HOSTS` to your domains only
- [ ] Use a production database (PostgreSQL/MySQL)
- [ ] Set up proper file permissions
- [ ] Enable firewall rules

### Frontend Security:
- [ ] Remove development tools from production build
- [ ] Set proper CSP headers
- [ ] Use HTTPS for all resources
- [ ] Validate all user inputs

## 📊 Monitoring & Maintenance

### Health Checks:
```bash
# Backend health
curl http://localhost:8000/docs

# Frontend health
curl http://localhost/

# Docker health
docker-compose ps
```

### Logs:
```bash
# Application logs
docker-compose logs app

# Nginx logs
docker-compose logs nginx

# Follow logs
docker-compose logs -f
```

### Database Backup:
```bash
# SQLite backup
cp backend/cheriyan_studio.db backup/cheriyan_studio_$(date +%Y%m%d).db

# PostgreSQL backup
pg_dump $DATABASE_URL > backup/db_$(date +%Y%m%d).sql
```

## 🔄 Updates & Maintenance

### Application Updates:
```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
./scripts/deploy.sh production

# Or with Docker
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Migrations:
```bash
# Run migration scripts
cd backend
source venv/bin/activate
python migrate_database.py
```

## 🌍 Environment Variables

### Required Production Variables:
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-super-secure-secret-key-here
DATABASE_URL=postgresql://user:pass@localhost/db
ALLOWED_HOSTS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional Variables:
```env
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
MAX_FILE_SIZE=10485760
UPLOAD_DIR=app/static/images
HOST=0.0.0.0
PORT=8000
```

## 🆘 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Check `ALLOWED_HOSTS` in environment
- Verify frontend URL is included

**2. File Upload Issues:**
- Check `UPLOAD_DIR` permissions
- Verify `MAX_FILE_SIZE` setting
- Check disk space

**3. Database Connection:**
- Verify `DATABASE_URL` format
- Check database server status
- Ensure database exists

**4. SSL/HTTPS Issues:**
- Verify certificate paths
- Check certificate validity
- Ensure port 443 is open

### Debug Commands:
```bash
# Check container status
docker-compose ps

# View application logs
docker-compose logs app

# Check nginx configuration
docker-compose exec nginx nginx -t

# Test database connection
docker-compose exec app python -c "from app.db.session import engine; print(engine.execute('SELECT 1').scalar())"
```

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment configuration
3. Test individual components
4. Check firewall and network settings

## 🎉 Success!

After successful deployment:
- **Frontend**: Available at your domain
- **API**: Available at `/api` endpoint
- **Admin**: Login at `/admin/login` (admin/admin123)
- **API Docs**: Available at `/docs`

Remember to change the default admin password after first login!
