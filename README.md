# Medical Test Records Application

A full-stack web application for managing and visualizing medical test records with secure authentication and real-time data visualization.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT with access/refresh tokens
- **Email**: SMTP for verification and password reset
- **Containerization**: Docker + Docker Compose

## Quick Start (Development)

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd labsmonitor
   ```

2. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Database: localhost:5432

4. **Stop the environment**
   ```bash
   docker-compose down
   ```

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed on production server
- Domain name with SSL certificate
- SMTP email service configured
- PostgreSQL database (or use the included one)

### Step 1: Environment Configuration

1. **Create production environment file**
   ```bash
   cp env.prod.template .env.prod
   ```

2. **Edit `.env.prod` with your production values**
   ```bash
   # Database Configuration
   DB_NAME=medtest_prod
   DB_USER=medtest_user
   DB_PASSWORD=your_secure_password_here

   # Security (Generate secure keys)
   SECRET_KEY=your_very_long_random_secret_key_here
   JWT_SECRET_KEY=your_jwt_secret_key_here

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password_here

   # Application Configuration
   ENVIRONMENT=production
   DEBUG=false
   LOG_LEVEL=INFO

   # CORS Origins (your domain)
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

3. **Generate secure secrets**
   ```bash
   # Generate SECRET_KEY
   openssl rand -hex 32
   
   # Generate JWT_SECRET_KEY
   openssl rand -hex 32
   ```

### Step 2: SSL Certificate Setup

**Option A: Let's Encrypt (Recommended)**
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/key.pem
```

**Option B: Self-signed (Development only)**
```bash
mkdir ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
```

### Step 3: Database Setup

1. **Create production database**
   ```bash
   # If using external PostgreSQL
   createdb medtest_prod
   createuser medtest_user
   psql -c "ALTER USER medtest_user PASSWORD 'your_secure_password';"
   psql -c "GRANT ALL PRIVILEGES ON DATABASE medtest_prod TO medtest_user;"
   ```

2. **Run database migrations**
   ```bash
   # Apply migrations
   docker-compose -f docker-compose.prod.yml exec backend python -m alembic upgrade head
   ```

### Step 4: Deploy Application

1. **Build and start production containers**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

2. **Verify deployment**
   ```bash
   # Check container status
   docker-compose -f docker-compose.prod.yml ps
   
   # Check logs
   docker-compose -f docker-compose.prod.yml logs -f
   ```

3. **Access your application**
   - Frontend: https://yourdomain.com
   - API: https://yourdomain.com/api

### Step 5: Post-Deployment Setup

1. **Create admin user**
   ```bash
   # Access the application and register your first admin user
   # Or use the API directly
   curl -X POST https://yourdomain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@yourdomain.com","password":"secure_password","firstName":"Admin","lastName":"User"}'
   ```

2. **Set up monitoring**
   ```bash
   # Check application health
   curl https://yourdomain.com/api/health
   
   # Monitor logs
   docker-compose -f docker-compose.prod.yml logs -f backend
   ```

3. **Configure backups**
   ```bash
   # Database backup script
   #!/bin/bash
   docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

## Configuration Options

### Frontend Configuration
- **Environment Variables**: Set in `frontend/.env.production`
- **API URL**: Configure `VITE_API_URL` for backend endpoint
- **Build Optimization**: Production builds are optimized and minified

### Backend Configuration
- **Database**: Configure `DATABASE_URL` in environment
- **Email**: Set SMTP credentials for email functionality
- **Security**: Configure CORS origins and JWT settings
- **Logging**: Set log level and output format

### Nginx Configuration
- **SSL**: Configure SSL certificates in `frontend/nginx.conf`
- **Caching**: Static assets are cached for 1 year
- **Compression**: Gzip compression enabled
- **Security Headers**: XSS protection, frame options, etc.

## Security Considerations

### Production Security Checklist
- [ ] Use strong, unique passwords for all services
- [ ] Generate secure random keys for JWT and application secrets
- [ ] Configure proper CORS origins
- [ ] Set up SSL/TLS certificates
- [ ] Enable security headers
- [ ] Use non-root containers
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Configure automated backups
- [ ] Keep dependencies updated

### Environment Variables Security
```bash
# Never commit .env.prod to version control
echo ".env.prod" >> .gitignore

# Use secrets management in production
# Consider using Docker Secrets or HashiCorp Vault
```

## Monitoring and Maintenance

### Health Checks
```bash
# Application health
curl https://yourdomain.com/api/health

# Database health
docker-compose -f docker-compose.prod.yml exec db pg_isready

# Container status
docker-compose -f docker-compose.prod.yml ps
```

### Logs
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs

# Follow specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Updates
```bash
# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Update database schema
docker-compose -f docker-compose.prod.yml exec backend python -m alembic upgrade head
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database container
   docker-compose -f docker-compose.prod.yml logs db
   
   # Verify environment variables
   docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE
   ```

2. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl x509 -in ssl/cert.pem -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

3. **Email Not Working**
   ```bash
   # Check SMTP configuration
   docker-compose -f docker-compose.prod.yml exec backend python -c "from email_service import test_smtp; test_smtp()"
   ```

4. **High Memory Usage**
   ```bash
   # Monitor resource usage
   docker stats
   
   # Optimize container resources in docker-compose.prod.yml
   ```

## API Documentation

Once deployed, access the interactive API documentation at:
- Swagger UI: https://yourdomain.com/docs
- ReDoc: https://yourdomain.com/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation


