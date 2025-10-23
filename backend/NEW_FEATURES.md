# Cheriyan Studio Showcase - New Features & AWS EC2 Deployment Guide

This document describes the new features added to the Cheriyan Studio Showcase API and provides a comprehensive guide for deploying to AWS EC2 with Ubuntu.

## New Features Added

## 1. Business Hours Management

### Overview
Admin can now manage business hours for each day of the week through the API.

### API Endpoints
- `GET /api/business-hours/` - Get all business hours
- `GET /api/business-hours/{day_of_week}` - Get business hours for a specific day
- `POST /api/business-hours/` - Create business hours (Admin only)
- `PUT /api/business-hours/{day_of_week}` - Update business hours (Admin only)
- `DELETE /api/business-hours/{day_of_week}` - Delete business hours (Admin only)

### Default Business Hours
- **Monday - Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 10:00 AM - 4:00 PM
- **Sunday**: By Appointment Only

### Database Schema
```sql
CREATE TABLE business_hours (
    id INTEGER PRIMARY KEY,
    day_of_week VARCHAR NOT NULL UNIQUE,
    is_open BOOLEAN DEFAULT TRUE,
    open_time VARCHAR,
    close_time VARCHAR,
    is_by_appointment BOOLEAN DEFAULT FALSE,
    notes VARCHAR,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

## 2. Contact Details Management

### Overview
Admin can now manage contact information (email, phone, address) through the API.

### API Endpoints
- `GET /api/contact-details/` - Get all contact details
- `GET /api/contact-details/{contact_id}` - Get specific contact detail
- `POST /api/contact-details/` - Create contact details (Admin only)
- `PUT /api/contact-details/{contact_id}` - Update contact details (Admin only)
- `DELETE /api/contact-details/{contact_id}` - Delete contact details (Admin only)

### Database Schema
```sql
CREATE TABLE contact_details (
    id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

## 3. Profile Picture Support for Images

### Overview
Images can now be marked as profile pictures using the `is_profile_picture` boolean field.

### Changes Made
- Added `is_profile_picture` field to Image model
- Updated image schemas to include the new field
- Updated image upload API to accept `is_profile_picture` parameter
- Updated image update API to handle the new field

### API Usage
When uploading an image, you can now specify:
```
POST /api/images/
Form data:
- file: [image file]
- title: "Profile Picture"
- is_profile_picture: true
- ... other fields
```

## Installation and Setup

### 1. Run Database Migration
```bash
cd backend
python migrate_new_features.py
```

### 2. Initialize Business Hours (Optional)
If you want to set up default business hours:
```bash
python init_business_hours.py
```

### 3. Start the Server
```bash
python start.py
```

## API Examples

### Get Business Hours
```bash
curl -X GET "http://localhost:8000/api/business-hours/"
```

### Update Business Hours for Monday
```bash
curl -X PUT "http://localhost:8000/api/business-hours/Monday" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_open": true,
    "open_time": "09:00",
    "close_time": "18:00"
  }'
```

### Create Contact Details
```bash
curl -X POST "http://localhost:8000/api/contact-details/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@cheriyanstudio.com",
    "phone": "+1-555-123-4567",
    "address": "123 Photography St, City, State 12345"
  }'
```

### Upload Profile Picture
```bash
curl -X POST "http://localhost:8000/api/images/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@profile.jpg" \
  -F "title=Profile Picture" \
  -F "is_profile_picture=true"
```

## Database Models

### BusinessHours Model
```python
class BusinessHours(Base):
    __tablename__ = "business_hours"
    
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String, nullable=False, unique=True)
    is_open = Column(Boolean, default=True)
    open_time = Column(String)
    close_time = Column(String)
    is_by_appointment = Column(Boolean, default=False)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### ContactDetails Model
```python
class ContactDetails(Base):
    __tablename__ = "contact_details"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

## Notes

- All new endpoints require authentication (Admin only for write operations)
- Business hours are stored per day of the week
- Contact details are stored as a single record (only one set of contact details)
- Profile pictures are marked using the `is_profile_picture` boolean field on images
- All timestamps are stored in UTC
- The migration script is idempotent and can be run multiple times safely

---

# AWS EC2 Deployment Guide

## Prerequisites

- AWS EC2 instance with Ubuntu 20.04+ (t2.micro or larger)
- Domain name pointing to your EC2 public IP
- SSH access to your EC2 instance
- Basic knowledge of Linux commands

## Step 1: Initial Server Setup

### 1.1 Update System and Install Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y git python3-venv python3-pip nginx ufw curl wget unzip

# Install Node.js 18.x for frontend build
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
python3 --version
node --version
npm --version
```

### 1.2 Configure Firewall

```bash
# Configure UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

## Step 2: Project Setup

### 2.1 Clone Repository

```bash
# Create project directory
sudo mkdir -p /var/www/cheriyan
sudo chown $USER:$USER /var/www/cheriyan
cd /var/www/cheriyan

# Clone your repository
git clone https://github.com/your-username/cheriyan-studio-showcase.git .

# Set proper permissions
sudo chown -R $USER:$USER /var/www/cheriyan
```

### 2.2 Clean Up Unnecessary Files

```bash
# Remove development files
rm -rf backend/venv/
rm -rf frontend/node_modules/
rm -rf frontend/dist/
rm -f backend/app.db backend/cheriyan_studio.db
rm -f backend/*.pyc backend/**/*.pyc
rm -f test.html

# Remove Render-specific files (if not using Render)
rm -f backend/render.yaml backend/render-minimal.yaml
rm -f backend/requirements-render.txt backend/requirements-minimal.txt
rm -f backend/requirements-stable.txt
rm -f RENDER_DEPLOYMENT.md RENDER_TROUBLESHOOTING.md
rm -f deploy-to-render.sh
rm -f frontend/render.yaml

# Remove Docker files (if not using Docker)
rm -f Dockerfile docker-compose.yml

# Remove legacy scripts (keep only current ones)
rm -f backend/add_sample_images.py
rm -f backend/add_social_media_table.py
rm -f backend/fix_image_categories.py
rm -f backend/create_tables.py
rm -f backend/migrate_database.py
rm -f backend/create_admin_simple.py
```

## Step 3: Backend Setup

### 3.1 Create Virtual Environment

```bash
cd /var/www/cheriyan/backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.2 Configure Environment Variables

```bash
# Create environment file
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=sqlite:///./app.db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS Configuration
CORS_ORIGINS=["https://your-domain.com", "http://localhost:5173"]

# API Configuration
PROJECT_NAME=Cheriyan Studio Showcase API
VERSION=1.0.0
DEBUG=False

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
EOF

# Set proper permissions
chmod 600 .env
```

### 3.3 Database Setup and Migration

```bash
# Ensure we're in the backend directory with venv activated
cd /var/www/cheriyan/backend
source .venv/bin/activate

# Create database directory and set permissions
mkdir -p app/data
sudo chown -R $USER:$USER app/data

# Run database migration
python migrate_new_features.py

# Initialize business hours with default values
python init_business_hours.py

# Create admin user (if needed)
python scripts/create_admin.py
```

### 3.4 Test Database Connection

```bash
# Test the database setup
python -c "
from app.db.session import SessionLocal
from app.models import *
db = SessionLocal()
print('Database connection successful!')
print('Tables created:', db.execute('SELECT name FROM sqlite_master WHERE type=\"table\"').fetchall())
db.close()
"
```

## Step 4: Frontend Setup

### 4.1 Install Dependencies and Build

```bash
cd /var/www/cheriyan/frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Create production directory
sudo mkdir -p /var/www/cheriyan/frontend_build
sudo rsync -a dist/ /var/www/cheriyan/frontend_build/
sudo chown -R www-data:www-data /var/www/cheriyan/frontend_build
```

## Step 5: System Service Configuration

### 5.1 Create Systemd Service

```bash
# Create systemd service file
sudo tee /etc/systemd/system/cheriyan-api.service > /dev/null << 'EOF'
[Unit]
Description=Cheriyan Studio API
After=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/cheriyan/backend
Environment="PATH=/var/www/cheriyan/backend/.venv/bin"
Environment="PYTHONPATH=/var/www/cheriyan/backend"
ExecStart=/var/www/cheriyan/backend/.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker app.main:app --bind 127.0.0.1:8000 --workers 2 --timeout 60 --access-logfile /var/log/cheriyan-api-access.log --error-logfile /var/log/cheriyan-api-error.log
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable cheriyan-api
sudo systemctl start cheriyan-api

# Check service status
sudo systemctl status cheriyan-api
```

### 5.2 Configure Log Rotation

```bash
# Create log rotation configuration
sudo tee /etc/logrotate.d/cheriyan-api > /dev/null << 'EOF'
/var/log/cheriyan-api-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload cheriyan-api
    endscript
}
EOF
```

## Step 6: Nginx Configuration

### 6.1 Create Nginx Configuration

```bash
# Create Nginx site configuration
sudo tee /etc/nginx/sites-available/cheriyan > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend static files
    root /var/www/cheriyan/frontend_build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Static files from backend (images, etc.)
    location /static/ {
        proxy_pass http://127.0.0.1:8000/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend routes (SPA support)
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Security: deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Logging
    access_log /var/log/nginx/cheriyan_access.log;
    error_log /var/log/nginx/cheriyan_error.log;
}
EOF

# Enable site and disable default
sudo ln -s /etc/nginx/sites-available/cheriyan /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 7: SSL Certificate with Let's Encrypt

### 7.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Obtain SSL Certificate

```bash
# Replace your-domain.com with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test certificate renewal
sudo certbot renew --dry-run
```

## Step 8: Database Management Scripts

### 8.1 Create Database Backup Script

```bash
# Create backup script
sudo tee /usr/local/bin/backup-cheriyan-db.sh > /dev/null << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/cheriyan"
DB_PATH="/var/www/cheriyan/backend/app.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/app_$DATE.db
find $BACKUP_DIR -name "app_*.db" -mtime +7 -delete
echo "Database backed up to $BACKUP_DIR/app_$DATE.db"
EOF

sudo chmod +x /usr/local/bin/backup-cheriyan-db.sh

# Create daily backup cron job
echo "0 2 * * * /usr/local/bin/backup-cheriyan-db.sh" | sudo crontab -
```

### 8.2 Create Database Reset Script

```bash
# Create database reset script for development
sudo tee /usr/local/bin/reset-cheriyan-db.sh > /dev/null << 'EOF'
#!/bin/bash
cd /var/www/cheriyan/backend
source .venv/bin/activate

# Stop API service
sudo systemctl stop cheriyan-api

# Backup current database
cp app.db app.db.backup.$(date +%Y%m%d_%H%M%S)

# Remove old database
rm -f app.db

# Run migrations
python migrate_new_features.py
python init_business_hours.py

# Start API service
sudo systemctl start cheriyan-api

echo "Database reset completed"
EOF

sudo chmod +x /usr/local/bin/reset-cheriyan-db.sh
```

## Step 9: Deployment Script

### 9.1 Create Deployment Script

```bash
# Create deployment script
sudo tee /usr/local/bin/deploy-cheriyan.sh > /dev/null << 'EOF'
#!/bin/bash
set -e

PROJECT_DIR="/var/www/cheriyan"
BACKUP_DIR="/var/backups/cheriyan"

echo "Starting deployment..."

# Backup current database
mkdir -p $BACKUP_DIR
cp $PROJECT_DIR/backend/app.db $BACKUP_DIR/app_backup_$(date +%Y%m%d_%H%M%S).db

# Pull latest changes
cd $PROJECT_DIR
git pull origin main

# Update backend
cd backend
source .venv/bin/activate
pip install -r requirements.txt

# Run migrations
python migrate_new_features.py

# Restart API service
sudo systemctl restart cheriyan-api

# Update frontend
cd ../frontend
npm ci
npm run build
sudo rsync -a dist/ /var/www/cheriyan/frontend_build/
sudo chown -R www-data:www-data /var/www/cheriyan/frontend_build

# Reload Nginx
sudo systemctl reload nginx

echo "Deployment completed successfully!"
EOF

sudo chmod +x /usr/local/bin/deploy-cheriyan.sh
```

## Step 10: Monitoring and Maintenance

### 10.1 Create Health Check Script

```bash
# Create health check script
sudo tee /usr/local/bin/health-check.sh > /dev/null << 'EOF'
#!/bin/bash

# Check API service
if ! systemctl is-active --quiet cheriyan-api; then
    echo "API service is down, restarting..."
    sudo systemctl restart cheriyan-api
fi

# Check Nginx
if ! systemctl is-active --quiet nginx; then
    echo "Nginx is down, restarting..."
    sudo systemctl restart nginx
fi

# Check database
if [ ! -f "/var/www/cheriyan/backend/app.db" ]; then
    echo "Database file missing!"
    exit 1
fi

echo "All services are running"
EOF

sudo chmod +x /usr/local/bin/health-check.sh

# Add to crontab for regular checks
echo "*/5 * * * * /usr/local/bin/health-check.sh" | sudo crontab -
```

## Step 11: Final Verification

### 11.1 Test All Components

```bash
# Check all services
sudo systemctl status cheriyan-api
sudo systemctl status nginx

# Test API endpoints
curl -I http://localhost:8000/health
curl -I https://your-domain.com/api/

# Check SSL certificate
sudo certbot certificates

# Test frontend
curl -I https://your-domain.com/
```

## Step 12: Security Hardening

### 12.1 Additional Security Measures

```bash
# Update SSH configuration
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Set up automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Troubleshooting

### Common Issues and Solutions

1. **API Service Won't Start**
   ```bash
   sudo journalctl -u cheriyan-api -f
   sudo systemctl status cheriyan-api
   ```

2. **Database Permission Issues**
   ```bash
   sudo chown -R www-data:www-data /var/www/cheriyan/backend/app.db
   sudo chmod 664 /var/www/cheriyan/backend/app.db
   ```

3. **Frontend Not Loading**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **SSL Certificate Issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

## Maintenance Commands

```bash
# View API logs
sudo journalctl -u cheriyan-api -f

# View Nginx logs
sudo tail -f /var/log/nginx/cheriyan_error.log

# Restart services
sudo systemctl restart cheriyan-api
sudo systemctl restart nginx

# Deploy updates
/usr/local/bin/deploy-cheriyan.sh

# Reset database (development only)
/usr/local/bin/reset-cheriyan-db.sh

# Backup database
/usr/local/bin/backup-cheriyan-db.sh
```

This deployment guide provides a complete, production-ready setup for your Cheriyan Studio Showcase application on AWS EC2 with SQLite database, including security measures, monitoring, and maintenance procedures.
