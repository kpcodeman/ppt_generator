# Deployment Guide

This guide covers deploying the PPT Generator to various platforms.

## Vercel Deployment (Recommended)

### Prerequisites
- Vercel account
- GitHub repository
- Node.js 18+
- Python 3.11+

### Step 1: Prepare Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ppt-generator.git
git push -u origin main
```

### Step 2: Configure Vercel
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend/ppt_frontend && pnpm install && pnpm run build`
   - **Output Directory**: `frontend/ppt_frontend/dist`

### Step 3: Environment Variables
Set in Vercel dashboard:
```
PYTHONPATH=backend/ppt_backend
```

### Step 4: Deploy
```bash
vercel --prod
```

## Alternative Deployment Options

### Frontend Only (Netlify/Vercel)
```bash
cd frontend/ppt_frontend
pnpm run build
# Deploy dist/ folder
```

### Backend Only (Railway/Heroku)

#### Railway
```bash
cd backend/ppt_backend
railway login
railway init
railway up
```

#### Heroku
```bash
cd backend/ppt_backend
heroku create your-app-name
git push heroku main
```

### Docker Deployment

#### Dockerfile (Backend)
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/ppt_backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ppt_backend/ .
EXPOSE 5000

CMD ["python", "src/main.py"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY frontend/ppt_frontend/package.json frontend/ppt_frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY frontend/ppt_frontend/ .
RUN pnpm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
  
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

## Environment Configuration

### Production Environment Variables

#### Backend
```bash
FLASK_ENV=production
SECRET_KEY=your-super-secret-key
PORT=5000
```

#### Frontend
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Development Environment
```bash
# Backend
FLASK_ENV=development
FLASK_DEBUG=True

# Frontend
VITE_API_BASE_URL=http://localhost:5001
```

## SSL/HTTPS Configuration

### Vercel
Automatic HTTPS with custom domains

### Nginx (Self-hosted)
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## Performance Optimization

### Frontend
```bash
# Build optimization
cd frontend/ppt_frontend
pnpm run build

# Analyze bundle
pnpm run build -- --analyze
```

### Backend
```python
# Production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

## Monitoring & Logging

### Vercel Functions
- Built-in monitoring
- Function logs in dashboard

### Self-hosted
```python
import logging
logging.basicConfig(level=logging.INFO)

# Add to Flask app
if not app.debug:
    file_handler = logging.FileHandler('app.log')
    app.logger.addHandler(file_handler)
```

## Scaling Considerations

### Database
- Move from SQLite to PostgreSQL/MySQL
- Use Redis for session storage

### File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- Implement CDN for static assets

### Load Balancing
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}
```

## Security

### API Keys
- Use environment variables
- Implement rate limiting
- Add API key validation

### CORS
```python
CORS(app, origins=[
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com"
])
```

### File Upload Security
```python
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'ppt', 'pptx'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
```

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js/Python versions
- Verify dependencies in package.json/requirements.txt
- Clear cache: `pnpm store prune`

#### CORS Errors
- Verify backend CORS configuration
- Check frontend API base URL
- Ensure proper headers

#### File Upload Issues
- Check file size limits
- Verify MIME types
- Test with different file formats

#### Memory Issues
- Increase Vercel function memory
- Optimize image processing
- Implement file cleanup

### Debug Commands
```bash
# Frontend
pnpm run dev --debug

# Backend
FLASK_DEBUG=True python src/main.py

# Vercel logs
vercel logs
```

## Backup & Recovery

### Database Backup
```bash
# SQLite
cp backend/ppt_backend/src/database/app.db backup/

# PostgreSQL
pg_dump database_name > backup.sql
```

### File Backup
```bash
# Session files
tar -czf sessions_backup.tar.gz /tmp/ppt_sessions/
```

## Cost Optimization

### Vercel
- Monitor function execution time
- Optimize cold starts
- Use edge functions for static content

### Cloud Storage
- Implement file lifecycle policies
- Use compression for large files
- Clean up temporary files

This deployment guide should help you successfully deploy the PPT Generator to your preferred platform.

