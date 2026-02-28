# Deployment Guide

## Prerequisites

Before deploying the Task Management System, ensure you have:

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 4GB RAM available
- 10GB disk space
- Network access for pulling Docker images

## Quick Deployment

### 1. Initial Setup

```bash
# Clone or navigate to the project
cd taskManager

# Make scripts executable
chmod +x scripts/*.sh

# Run the setup script
./scripts/setup.sh
```

The setup script will:
- Check Docker installation
- Create .env file from template
- Build all Docker images
- Start all services
- Display service status

### 2. Verify Deployment

```bash
# Check all services are running
docker-compose ps

# All services should show "Up (healthy)"

# Check logs
docker-compose logs --tail=100

# Test the API
./scripts/test-api.sh
```

### 3. Access the Application

- **API Gateway**: http://localhost:3000
- **Nginx Proxy**: http://localhost
- **API Documentation**: See API_DOCUMENTATION.md

## Manual Deployment Steps

### Step 1: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file and update:
# - JWT_SECRET (use a strong random string)
# - JWT_REFRESH_SECRET (use a strong random string)
# - Database passwords
# - Allowed origins

nano .env
```

### Step 2: Build Images

```bash
# Build all services
docker-compose build --no-cache
```

This will build:
- auth-service
- user-service
- task-service
- api-gateway
- nginx

### Step 3: Start Databases

```bash
# Start databases first
docker-compose up -d postgres mongodb

# Wait for databases to be healthy (about 30 seconds)
docker-compose ps

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
```

### Step 4: Start Services

```bash
# Start all remaining services
docker-compose up -d

# Verify all services are running
docker-compose ps
```

### Step 5: Initialize Data (Optional)

```bash
# Create an admin user (requires jq)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "firstName": "Admin",
    "lastName": "User"
  }'

# You'll need to manually update the role in PostgreSQL
docker-compose exec postgres psql -U taskuser -d taskmanager -c \
  "UPDATE users SET role = 'admin' WHERE username = 'admin';"
```

## Production Deployment

### Pre-Production Checklist

- [ ] Update all secret keys in .env
- [ ] Use strong database passwords
- [ ] Configure SSL certificates
- [ ] Update allowed origins
- [ ] Remove database port exposure
- [ ] Enable HTTPS redirect in Nginx
- [ ] Setup backup scripts
- [ ] Configure monitoring
- [ ] Setup log rotation
- [ ] Review rate limiting settings

### Step 1: SSL/TLS Configuration

```bash
# Create SSL directory
mkdir -p nginx/ssl

# Option 1: Let's Encrypt (recommended for production)
# Install certbot and generate certificates
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# Option 2: Self-signed (for testing only)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem
```

### Step 2: Update Nginx Configuration

Edit `nginx/nginx.conf` and uncomment the HTTPS server block:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}
```

### Step 3: Update Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    # Remove ports exposure
    # ports:
    #   - "5432:5432"

  mongodb:
    # Remove ports exposure
    # ports:
    #   - "27017:27017"

  nginx:
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl:ro
```

### Step 4: Deploy

```bash
# Set production environment
export NODE_ENV=production

# Deploy with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verify
docker-compose ps
curl https://yourdomain.com/health
```

## Scaling

### Horizontal Scaling

```bash
# Scale task service to 3 instances
docker-compose up -d --scale task-service=3

# Scale API gateway to 2 instances
docker-compose up -d --scale api-gateway=2

# Verify
docker-compose ps
```

### Database Scaling

For production, consider:

**PostgreSQL**:
```yaml
# Add read replicas
postgres-replica:
  image: postgres:15-alpine
  environment:
    POSTGRES_MASTER_SERVICE_HOST: postgres
    # Configure replication
```

**MongoDB**:
```yaml
# Configure replica set
mongodb:
  command: mongod --replSet rs0
```

## Backup & Restore

### Backup

```bash
# PostgreSQL
docker-compose exec postgres pg_dump -U taskuser taskmanager \
  | gzip > backups/postgres_$(date +%Y%m%d_%H%M%S).sql.gz

# MongoDB
docker-compose exec mongodb mongodump \
  --username taskuser \
  --password taskpass \
  --authenticationDatabase admin \
  --out=/backup

# Copy from container
docker cp taskmanager-mongodb:/backup ./backups/mongodb_$(date +%Y%m%d_%H%M%S)
```

### Automated Backups

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/taskManager/scripts/backup.sh
```

Create `scripts/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/taskmanager"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker-compose exec -T postgres pg_dump -U taskuser taskmanager \
  | gzip > $BACKUP_DIR/postgres_$DATE.sql.gz

# MongoDB backup
docker-compose exec mongodb mongodump \
  --username taskuser \
  --password taskpass \
  --authenticationDatabase admin \
  --out=/backup

docker cp taskmanager-mongodb:/backup $BACKUP_DIR/mongodb_$DATE

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Restore

```bash
# PostgreSQL
gunzip < backup.sql.gz | docker-compose exec -T postgres psql -U taskuser -d taskmanager

# MongoDB
docker cp backup_folder taskmanager-mongodb:/backup
docker-compose exec mongodb mongorestore \
  --username taskuser \
  --password taskpass \
  --authenticationDatabase admin \
  /backup
```

## Monitoring

### Log Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f task-service

# View recent logs
docker-compose logs --tail=100
```

### Health Monitoring

```bash
# Check all health endpoints
for service in auth-service user-service task-service api-gateway; do
  echo "Checking $service..."
  curl -s http://localhost:3000/health | jq
done
```

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network usage
docker network inspect taskmanager-network
```

### Setup Prometheus & Grafana (Optional)

Add to `docker-compose.yml`:

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  depends_on:
    - prometheus
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build --force-recreate [service-name]
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres mongodb

# Test connection
docker-compose exec postgres psql -U taskuser -d taskmanager -c "SELECT 1;"
docker-compose exec mongodb mongosh -u taskuser -p taskpass --authenticationDatabase admin

# Check environment variables
docker-compose exec auth-service env | grep POSTGRES
```

### Port Conflicts

```bash
# Check what's using the port
sudo netstat -tlnp | grep :3000

# Kill the process or change port in .env
```

### Out of Memory

```bash
# Check Docker resources
docker stats

# Increase Docker memory limit
# Edit Docker Desktop settings or /etc/docker/daemon.json
```

### Performance Issues

```bash
# Check database indexes
docker-compose exec postgres psql -U taskuser -d taskmanager -c "\d+ users"

# Check container resources
docker stats

# Enable query logging
# Edit service to add DEBUG=* environment variable
```

## Updates & Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild images
docker-compose build --no-cache

# Restart with new images
docker-compose up -d

# Verify
docker-compose ps
./scripts/test-api.sh
```

### Update Dependencies

```bash
# Update Node.js packages in each service
cd auth-service
npm update
cd ..

# Rebuild
docker-compose build --no-cache auth-service
docker-compose up -d auth-service
```

### Database Migrations

For schema changes, create migration scripts:

```bash
# PostgreSQL migration
docker-compose exec postgres psql -U taskuser -d taskmanager < migration.sql

# MongoDB migration
docker-compose exec mongodb mongosh -u taskuser -p taskpass \
  --authenticationDatabase admin taskmanager < migration.js
```

## Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Full cleanup
./scripts/cleanup.sh
```

## Security Hardening

### 1. Network Security

```bash
# Use Docker secrets instead of environment variables
docker secret create jwt_secret jwt_secret.txt
```

### 2. Container Security

```yaml
# Add security options to docker-compose.yml
services:
  auth-service:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

### 3. Regular Updates

```bash
# Update base images regularly
docker-compose pull
docker-compose up -d

# Update Node.js dependencies
npm audit fix
```

### 4. Access Control

```bash
# Restrict database access
# Only allow connections from application network

# Setup firewall rules
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 27017/tcp
sudo ufw deny 5432/tcp
```

## Support

For issues and questions:
1. Check logs: `docker-compose logs [service]`
2. Review API_DOCUMENTATION.md
3. Review ARCHITECTURE.md
4. Open an issue on GitHub

---

**Remember**: Always test in staging before deploying to production!
