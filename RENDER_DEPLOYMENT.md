# Render Deployment Guide

This guide will help you deploy your Medical Test Records Application on Render.

## 🚀 **Quick Setup**

### **1. Create Three Services on Render**

#### **Frontend Service (Web Service)**
- **Name**: `labsmonitor-frontend`
- **Dockerfile Path**: `Dockerfile.render`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Environment**: `Docker`

#### **Backend Service (Web Service)**
- **Name**: `labsmonitor-backend`
- **Dockerfile Path**: `Dockerfile.render`
- **Branch**: `main`
- **Root Directory**: `backend`
- **Environment**: `Docker`

#### **Database Service (PostgreSQL)**
- **Name**: `labsmonitor-db`
- **Type**: PostgreSQL
- **Version**: 15
- **Plan**: Free (or choose based on your needs)

## ⚙️ **Environment Variables Configuration**

### **Frontend Environment Variables**
```
NODE_ENV=production
VITE_API_URL=https://your-backend-service-name.onrender.com
```

### **Backend Environment Variables**
```
DATABASE_URL=postgresql+asyncpg://username:password@host:5432/database_name
SECRET_KEY=your-secure-secret-key-here
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS Origins (your frontend URL)
ALLOWED_ORIGINS=https://your-frontend-service-name.onrender.com
```

### **Database Connection**
After creating the PostgreSQL service, Render will provide you with:
- **Internal Database URL**: Use this for the `DATABASE_URL` environment variable
- **External Database URL**: For external connections (if needed)

## 🔧 **Render-Specific Configuration**

### **Production-Ready Dockerfiles**
This deployment uses specially optimized Dockerfiles for Render:

#### **Frontend (`frontend/Dockerfile.render`)**
- **Multi-stage build** for smaller production images
- **Nginx server** for serving static assets
- **Optimized caching** and compression
- **Security headers** for production
- **React Router support** with proper fallbacks

#### **Backend (`backend/Dockerfile.render`)**
- **Non-root user** for security
- **Production WSGI server** (uvicorn)
- **Optimized for Render's environment**
- **No SSL certificates** (Render handles HTTPS)
- **Single worker** for Render's free tier

### **Port Configuration**
Render automatically sets the `PORT` environment variable. The production Dockerfiles are configured to work with Render's port assignment:

#### **For Frontend (if needed)**
Update the frontend Dockerfile to use the PORT environment variable:
```dockerfile
# In frontend/Dockerfile
EXPOSE $PORT
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "$PORT"]
```

#### **For Backend (if needed)**
Update the backend Dockerfile to use the PORT environment variable:
```dockerfile
# In backend/Dockerfile
EXPOSE $PORT
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "$PORT"]
```

### **Health Check Endpoints**
Add health check endpoints to your backend for better monitoring:

```python
# Add to backend/main.py
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

## 📋 **Step-by-Step Deployment**

### **Step 1: Prepare Your Repository**
1. Ensure your code is pushed to GitHub/GitLab
2. Make sure all Dockerfiles are in the correct locations:
   - `frontend/Dockerfile.render` (production-ready for Render)
   - `backend/Dockerfile.render` (production-ready for Render)

### **Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub/GitLab account
3. Connect your repository

### **Step 3: Create Database Service**
1. Click "New +" → "PostgreSQL"
2. **Name**: `labsmonitor-db`
3. **Database**: `medtest`
4. **User**: `medtest_user`
5. **Region**: Choose closest to your users
6. **Plan**: Free (or paid for production)
7. Click "Create Database"

### **Step 4: Create Backend Service**
1. Click "New +" → "Web Service"
2. **Connect your repository**
3. **Name**: `labsmonitor-backend`
4. **Dockerfile Path**: `Dockerfile.render`
5. **Branch**: `main`
6. **Root Directory**: `backend`
7. **Environment**: `Docker`
8. **Region**: Same as database
9. **Plan**: Free (or paid for production)

#### **Backend Environment Variables**
Add these environment variables:
```
DATABASE_URL=postgresql+asyncpg://medtest_user:password@host:5432/medtest
SECRET_KEY=your-secure-secret-key
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALLOWED_ORIGINS=https://your-frontend-service-name.onrender.com
```

**Important**: 
- Replace the `DATABASE_URL` with the Internal Database URL from your PostgreSQL service
- The application will automatically convert `postgresql://` to `postgresql+asyncpg://` if needed

**Important**: Replace the `DATABASE_URL` with the Internal Database URL from your PostgreSQL service.

### **Step 5: Create Frontend Service**
1. Click "New +" → "Web Service"
2. **Connect your repository**
3. **Name**: `labsmonitor-frontend`
4. **Dockerfile Path**: `Dockerfile.render`
5. **Branch**: `main`
6. **Root Directory**: `frontend`
7. **Environment**: `Docker`
8. **Region**: Same as other services
9. **Plan**: Free (or paid for production)

#### **Frontend Environment Variables**
Add these environment variables:
```
NODE_ENV=production
VITE_API_URL=https://your-backend-service-name.onrender.com
```

**Important**: 
- Replace `your-backend-service-name` with the actual name of your backend service (e.g., `labsmonitor-backend`)
- The `VITE_API_URL` must be set as a **build-time environment variable** for Vite to inject it into the client-side code

**Important**: Replace `your-backend-service-name` with the actual name of your backend service.

## 🔍 **Verification Steps**

### **1. Check Service Status**
- Go to your Render dashboard
- Verify all services show "Live" status
- Check logs for any errors

### **2. Test Backend API**
```bash
# Test health endpoint
curl https://your-backend-service-name.onrender.com/health

# Test root endpoint
curl https://your-backend-service-name.onrender.com/

# Test API documentation
curl https://your-backend-service-name.onrender.com/docs
```

### **3. Test Frontend**
- Visit your frontend URL
- Try to register a new user
- Test the login functionality

### **4. Test Database Connection**
- Try creating a test record
- Verify data is being stored in the database

## 🚨 **Common Issues and Solutions**

### **Issue 1: Database Connection Failed**
**Symptoms**: Backend fails to start, database connection errors
**Solution**:
1. Check the `DATABASE_URL` environment variable
2. Ensure you're using the Internal Database URL
3. Verify the database service is running

### **Issue 2: CORS Errors**
**Symptoms**: Frontend can't connect to backend API
**Solution**:
1. Update `ALLOWED_ORIGINS` in backend environment variables
2. Include your frontend URL: `https://your-frontend-service-name.onrender.com`

### **Issue 3: Port Issues**
**Symptoms**: Service fails to start, port binding errors
**Solution**:
1. Ensure your Dockerfiles use the `PORT` environment variable
2. Check that the port is properly exposed

### **Issue 4: Build Failures**
**Symptoms**: Service deployment fails during build
**Solution**:
1. Check the build logs in Render dashboard
2. Verify all dependencies are in `package.json` and `requirements.txt`
3. Ensure Dockerfiles are in the correct locations

### **Issue 5: Frontend API URL Not Working**
**Symptoms**: Frontend still uses localhost URLs, API calls fail
**Solution**:
1. Ensure `VITE_API_URL` is set in frontend environment variables
2. Check browser console for the debug logs showing the actual baseURL
3. Verify the backend service URL is correct and accessible
4. Make sure the environment variable is set before the build process

## 🔒 **Security Best Practices**

### **Environment Variables**
- Never commit sensitive data to your repository
- Use strong, unique passwords
- Generate secure random keys for secrets

### **Database Security**
- Use the Internal Database URL for backend connection
- Don't expose database credentials in logs
- Regularly backup your database

### **API Security**
- Configure proper CORS origins
- Use HTTPS (Render provides this automatically)
- Implement rate limiting if needed

## 📊 **Monitoring and Maintenance**

### **Health Checks**
- Monitor service status in Render dashboard
- Set up alerts for service failures
- Check logs regularly for errors

### **Scaling**
- Start with free plans for testing
- Upgrade to paid plans for production use
- Monitor resource usage

### **Updates**
- Render automatically redeploys on git push
- Test changes in development first
- Monitor deployment logs

## 🆘 **Support**

### **Render Support**
- Check Render documentation: [docs.render.com](https://docs.render.com)
- Contact Render support for platform issues
- Use Render community forums

### **Application Issues**
- Check application logs in Render dashboard
- Verify environment variables are correct
- Test locally before deploying

## 📝 **Post-Deployment Checklist**

- [ ] All services are "Live" in Render dashboard
- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Database connection works
- [ ] User registration works
- [ ] User login works
- [ ] Test record creation works
- [ ] Email functionality works (if configured)
- [ ] CORS is properly configured
- [ ] Environment variables are secure

## 🎉 **Success!**

Once all services are deployed and working:
- Your frontend will be available at: `https://your-frontend-service-name.onrender.com`
- Your backend API will be available at: `https://your-backend-service-name.onrender.com`
- API documentation will be at: `https://your-backend-service-name.onrender.com/docs`

Your Medical Test Records Application is now live on Render! 🚀 