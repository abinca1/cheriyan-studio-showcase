# 🚀 Render Deployment Guide - Cheriyan Studio Showcase

This guide covers deploying the Cheriyan Studio Showcase to Render with separate frontend and backend services.

## 📁 Project Structure

```
cheriyan-studio-showcase/
├── frontend/           # React/TypeScript frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── render.yaml
├── backend/            # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   ├── start.py
│   ├── build.sh
│   └── render.yaml
└── README.md
```

## 🔧 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Environment Variables**: Prepare production settings

## 🚀 Deployment Steps

### 1. Deploy Backend API

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` directory as root

2. **Configure Backend Service**:
   ```yaml
   Name: cheriyan-studio-api
   Environment: Python
   Build Command: ./build.sh
   Start Command: python start.py
   ```

3. **Set Environment Variables**:
   ```env
   ENVIRONMENT=production
   DEBUG=false
   SECRET_KEY=your-super-secure-secret-key-here
   ALLOWED_HOSTS=https://cheriyan-studio.onrender.com,https://cheriyan-studio-api.onrender.com
   HOST=0.0.0.0
   PORT=10000
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=app/static/images
   ALLOWED_EXTENSIONS=.jpg,.jpeg,.png,.gif,.webp
   ```

4. **Optional: Add PostgreSQL Database**:
   - Create PostgreSQL database in Render
   - Set `DATABASE_URL` environment variable
   - Database will auto-connect

### 2. Deploy Frontend

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Select the `frontend` directory as root

2. **Configure Frontend Service**:
   ```yaml
   Name: cheriyan-studio-frontend
   Build Command: npm ci && npm run build
   Publish Directory: ./dist
   ```

3. **Set Environment Variables**:
   ```env
   NODE_ENV=production
   VITE_API_URL=https://cheriyan-studio-api.onrender.com
   ```

### 3. Update API URL

After backend deployment, update the frontend environment variable:
- Copy your backend service URL from Render
- Update `VITE_API_URL` in frontend environment variables
- Redeploy frontend

## 🔒 Security Configuration

### Backend Security:
- Generate a secure `SECRET_KEY` (32+ characters)
- Set `DEBUG=false` in production
- Configure `ALLOWED_HOSTS` with your actual domains
- Use PostgreSQL for production database

### Frontend Security:
- Set `NODE_ENV=production`
- Configure proper CORS origins
- Use HTTPS for all resources

## 📊 Environment Variables Reference

### Backend Required Variables:
```env
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://... (auto-set if using Render DB)
ALLOWED_HOSTS=https://yourdomain.com
HOST=0.0.0.0
PORT=10000
```

### Frontend Required Variables:
```env
NODE_ENV=production
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🔄 Automatic Deployments

### GitHub Integration:
- Render automatically deploys on git push
- Separate deployments for frontend and backend
- Build logs available in Render dashboard

### Manual Deployments:
- Use "Manual Deploy" button in Render dashboard
- Useful for testing configuration changes

## 🐛 Troubleshooting

### Common Issues:

**1. Build Failures:**
```bash
# Check build logs in Render dashboard
# Verify all dependencies in requirements.txt
# Ensure build.sh has execute permissions
```

**2. CORS Errors:**
```bash
# Verify ALLOWED_HOSTS includes frontend URL
# Check VITE_API_URL points to correct backend
# Ensure both services are deployed
```

**3. Database Connection:**
```bash
# Verify DATABASE_URL is set correctly
# Check if PostgreSQL service is running
# Review database connection logs
```

**4. File Upload Issues:**
```bash
# Verify UPLOAD_DIR permissions
# Check MAX_FILE_SIZE setting
# Ensure static file serving is working
```

### Debug Commands:
```bash
# View service logs
# Check environment variables
# Test API endpoints
# Verify static file access
```

## 📈 Performance Optimization

### Backend Optimizations:
- Use PostgreSQL instead of SQLite
- Configure proper worker count
- Enable gzip compression
- Set up proper caching headers

### Frontend Optimizations:
- Enable build optimizations in Vite
- Configure proper cache headers
- Use CDN for static assets
- Minimize bundle size

## 🔄 Updates and Maintenance

### Updating the Application:
1. Push changes to GitHub
2. Render automatically rebuilds and deploys
3. Monitor deployment logs
4. Test functionality after deployment

### Database Migrations:
1. Add migration scripts to build process
2. Test migrations in staging environment
3. Deploy during low-traffic periods
4. Monitor for any issues

## 📞 Support and Monitoring

### Health Checks:
- Backend: `/docs` endpoint
- Frontend: Root URL accessibility
- Database: Connection status

### Monitoring:
- Render provides basic metrics
- Set up external monitoring if needed
- Monitor error logs regularly

### Backup Strategy:
- Regular database backups
- Export user-uploaded images
- Version control for code changes

## 🎉 Success Checklist

After successful deployment:

- [ ] Backend API accessible at your Render URL
- [ ] Frontend loads correctly
- [ ] Admin login works (admin/admin123)
- [ ] Image upload functionality works
- [ ] Gallery displays images correctly
- [ ] Social media links work
- [ ] Testimonials system functional
- [ ] Category filtering works
- [ ] Mobile responsiveness verified

## 🔗 Useful Links

- **Render Documentation**: https://render.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Production Build**: https://vitejs.dev/guide/build.html

## 📝 Post-Deployment Tasks

1. **Change Default Credentials**:
   - Login to admin panel
   - Change default admin password
   - Update admin email if needed

2. **Content Management**:
   - Upload your actual portfolio images
   - Update testimonials
   - Configure social media links
   - Customize hero section content

3. **SEO and Analytics**:
   - Update meta tags with your information
   - Add Google Analytics if needed
   - Submit sitemap to search engines
   - Configure social media meta tags

4. **Custom Domain** (Optional):
   - Purchase domain name
   - Configure DNS settings
   - Set up SSL certificate
   - Update environment variables

Your Cheriyan Studio Showcase is now live on Render! 🎉📸
