# Database Configuration Guide

## Overview

The Task Management System now supports both local and external PostgreSQL databases.

## Configuration Options

### Option 1: External PostgreSQL (Recommended for Production)

If using an external database like **Neon**, **AWS RDS**, or any managed PostgreSQL service:

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

The `DATABASE_URL` takes priority and automatically enables SSL connections for security.

**Example (Neon)**:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-curly-king-ai9k43k0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Option 2: Local PostgreSQL (Development)

For local development with Docker-hosted PostgreSQL:

```env
DATABASE_URL=
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=taskpass123
POSTGRES_DB=taskmanager
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

Leave `DATABASE_URL` empty and the system will use individual connection parameters.

## Setup Instructions

### For External Database (Neon Example)

1. **Update `.env` file**:
   ```bash
   DATABASE_URL='postgresql://neondb_owner:npg_feNXuIVR6n4S@ep-curly-king-ai9k43k0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
   ```

2. **Comment out PostgreSQL service in docker-compose.yml** (optional):
   ```yaml
   # postgres:
   #   image: postgres:15-alpine
   #   # ... rest of config
   ```

3. **Initialize database schema**:
   ```bash
   # The auth-service will automatically create tables on first connection
   docker-compose up -d auth-service
   docker-compose logs -f auth-service
   ```

4. **Verify connection**:
   ```bash
   curl http://localhost:3000/health
   ```

### For Local Database

1. **Keep `.env` with default values**:
   ```bash
   DATABASE_URL=
   POSTGRES_HOST=postgres
   # ... other settings
   ```

2. **Start with full docker-compose**:
   ```bash
   docker-compose up -d
   ```

## Connection Priority

```
✓ If DATABASE_URL is set      → Use external database with SSL
✗ If DATABASE_URL is empty    → Use POSTGRES_* variables (local docker)
```

## Benefits of External Database

✅ **Managed Backups**: Automatic backups handled by cloud provider  
✅ **High Availability**: Replicas and failover built-in  
✅ **Scalability**: Easy to scale database independently  
✅ **Monitoring**: Cloud provider tools and dashboards  
✅ **Security**: Enterprise-grade security and compliance  
✅ **No Docker Overhead**: PostgreSQL runs on cloud infrastructure  

## Migration from Local to External

To migrate existing data from local Docker PostgreSQL to external database:

### Step 1: Backup Local Database
```bash
docker-compose exec postgres pg_dump -U taskuser taskmanager > backup.sql
```

### Step 2: Create Tables in External Database
```bash
# Start auth-service with external DATABASE_URL to create schema
docker-compose up auth-service
sleep 5
docker-compose down
```

### Step 3: Restore Data
```bash
# Install psql client
# psql --host=your-external-host --username=user --dbname=taskmanager < backup.sql
```

### Step 4: Update .env and Deploy
```bash
# Edit .env with DATABASE_URL
docker-compose up -d
```

## Testing Connection

### Test Auth Service Connection
```bash
curl -X GET http://localhost:3000/health
```

### Test with Direct Connection
```bash
# Using external database
psql "postgresql://user:password@host:port/database?sslmode=require"

# Run a test query
SELECT * FROM users;
```

### View Connection Logs
```bash
docker-compose logs auth-service
docker-compose logs user-service
```

## Troubleshooting

### "Connection refused" Error

**Cause**: Service can't reach database  
**Solution**:
- Verify DATABASE_URL is correct
- Check SSL mode settings
- Ensure database is accessible from container network

```bash
docker-compose logs auth-service
```

### "SSL connection error" Error

**Cause**: SSL mode mismatch  
**Solution**: Ensure `sslmode=require` is in DATABASE_URL

```env
DATABASE_URL=postgresql://...?sslmode=require
```

### "Authentication failed" Error

**Cause**: Wrong credentials in DATABASE_URL  
**Solution**:
- Copy entire connection string from database provider
- Verify username and password
- Check for special characters that need URL encoding

### Timeout Issues

**Cause**: Connection string might have wrong host  
**Solution**:
- Use pooler endpoint instead of direct endpoint (for Neon)
- Check firewall rules allow connections
- Verify correct region/datacentre

## Performance Tuning

### Connection Pooling

For better performance with external database, consider:

```javascript
// Already configured in the code:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  // Optional: Adjust these for better performance
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Security Best Practices

✅ **Never commit .env file** to version control  
✅ **Use strong passwords** for database credentials  
✅ **Enable SSL/TLS** for all connections  
✅ **Rotate credentials** regularly  
✅ **Use secrets management** (Docker Secrets, AWS Secrets Manager, etc.)  
✅ **Restrict database access** by IP whitelist  
✅ **Enable audit logging** on database  

## Environment Variables Reference

```env
# External database URL (recommended for production)
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require

# Local PostgreSQL settings
POSTGRES_USER=taskuser
POSTGRES_PASSWORD=taskpass123
POSTGRES_DB=taskmanager
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
```

## Support for Multiple Databases

The current implementation supports:
- ✅ PostgreSQL local (Docker)
- ✅ PostgreSQL external (Neon, AWS RDS, etc.)
- ✅ PostgreSQL on any cloud provider
- ❌ Other databases would require code changes (MySQL, etc.)

---

For questions or issues, refer to [DEPLOYMENT.md](DEPLOYMENT.md) or [README.md](README.md)
