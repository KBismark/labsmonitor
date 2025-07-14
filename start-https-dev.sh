#!/bin/bash

echo "🚀 Starting Labs Monitor with HTTPS support..."

# Build and start the containers
docker-compose up --build -d

echo "✅ Services started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔒 Backend HTTPS: https://localhost:8443"
echo "🔓 Backend HTTP: http://localhost:8000 (for compatibility)"
echo ""
echo "⚠️  Note: You may see a browser warning about the self-signed certificate."
echo "   This is normal for development. Click 'Advanced' and 'Proceed' to continue."
echo ""
echo "📧 Email service is now configured to work with HTTPS!"
echo ""
echo "To stop the services, run: docker-compose down" 