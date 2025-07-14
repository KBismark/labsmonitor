# HTTPS Development Setup

This project is configured to run with HTTPS in development to ensure email functionality works properly, as many email providers require secure connections.

## Quick Start

1. **Start the development environment:**
   ```bash
   chmod +x start-https-dev.sh
   ./start-https-dev.sh
   ```

2. **Access your application:**
   - Frontend: http://localhost:3000
   - Backend HTTPS: https://localhost:8443
   - Backend HTTP: http://localhost:8000 (for compatibility)

## What's Changed

### Backend (FastAPI)
- **Dockerfile**: Added OpenSSL installation and self-signed certificate generation
- **Port**: Now runs on port 8443 with HTTPS
- **SSL**: Uses self-signed certificates for development

### Frontend (React)
- **Axios Config**: Created centralized API configuration with HTTPS base URL
- **AuthContext**: Updated to use the new API configuration
- **Environment**: Set to use HTTPS API endpoints

### Docker Compose
- **Ports**: Added HTTPS port 8443 exposure
- **Environment**: Updated frontend to use HTTPS API URL

## Email Configuration

For the email service to work, you'll need to set these environment variables in your `backend/.env` file:

```env
# SMTP Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@labsmonitor.com
```

## Browser Security Warning

When accessing https://localhost:8443, your browser will show a security warning because we're using a self-signed certificate. This is normal for development:

1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"
3. The application will work normally

## Troubleshooting

### Certificate Issues
If you encounter certificate problems:
```bash
# Rebuild the backend container to regenerate certificates
docker-compose down
docker-compose up --build -d
```

### Email Not Sending
1. Check your SMTP credentials in `backend/.env`
2. Ensure you're using an app password for Gmail (not your regular password)
3. Verify the SMTP server and port are correct

### Frontend Can't Connect to Backend
1. Ensure both containers are running: `docker-compose ps`
2. Check the logs: `docker-compose logs backend`
3. Verify the API URL in the browser's network tab

## Production Deployment

For production, you should:
1. Use proper SSL certificates (Let's Encrypt, etc.)
2. Configure a reverse proxy (Nginx, Traefik)
3. Use environment-specific configurations
4. Set up proper domain names

## Commands

```bash
# Start development environment
./start-https-dev.sh

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
``` 