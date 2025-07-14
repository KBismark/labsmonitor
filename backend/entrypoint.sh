#!/bin/bash
set -e

# Generate SSL certificates if they do not exist
if [ ! -f /app/ssl/key.pem ] || [ ! -f /app/ssl/cert.pem ]; then
  echo "Generating self-signed SSL certificates..."
  mkdir -p /app/ssl
  openssl req -x509 -newkey rsa:4096 -keyout /app/ssl/key.pem -out /app/ssl/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
  chmod 600 /app/ssl/key.pem
  chmod 644 /app/ssl/cert.pem
else
  echo "SSL certificates already exist."
fi

# Start the FastAPI server with HTTPS
exec uvicorn main:app --host 0.0.0.0 --port 8443 --ssl-keyfile /app/ssl/key.pem --ssl-certfile /app/ssl/cert.pem --reload 