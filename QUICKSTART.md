# Quick Start Guide

Get the Task Management System up and running in under 5 minutes!

## Prerequisites

✅ Docker installed ([Get Docker](https://docs.docker.com/get-docker/))  
✅ Docker Compose installed (usually comes with Docker Desktop)  
✅ 4GB RAM available  
✅ 10GB disk space  

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Environment

```bash
cd taskManager
cp .env.example .env
```

**Optional**: Edit `.env` to customize (JWT secrets, passwords, etc.)

### Step 2: Start Everything

```bash
chmod +x scripts/*.sh
./scripts/setup.sh
```

This will:
- Build all Docker images
- Start all services
- Initialize databases
- Show service status

⏱️ **Wait time**: ~2-3 minutes for first build

### Step 3: Test It!

```bash
./scripts/test-api.sh
```

This creates a test user and performs various operations.

## 🎯 Your System is Ready!

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Main API** | http://localhost:3000 | Primary endpoint |
| **Nginx Proxy** | http://localhost | Load-balanced access |
| Auth Service | http://localhost:3001 | Direct auth access |
| User Service | http://localhost:3002 | Direct user access |
| Task Service | http://localhost:3003 | Direct task access |

### Quick API Test

```bash
# 1. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'

# Save the accessToken from response

# 2. Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My first task",
    "description": "This is a test task",
    "priority": "high"
  }'

# 3. Get all tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Common Operations

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f task-service

# Last 100 lines
docker-compose logs --tail=100
```

### Check Status

```bash
# Service health
docker-compose ps

# Resource usage
docker stats

# Health endpoint
curl http://localhost:3000/health
```

### Stop Services

```bash
# Stop all
docker-compose down

# Stop and remove data (⚠️ WARNING: deletes all data)
docker-compose down -v
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart one service
docker-compose restart task-service
```

## 📱 Example Workflow

### 1. Create Account

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. Login (Alternative)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### 3. Get Your Profile

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Create Tasks

```bash
# High priority task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Finish project report",
    "description": "Complete Q1 2026 report",
    "priority": "high",
    "dueDate": "2026-03-15",
    "tags": ["work", "urgent"]
  }'

# Medium priority task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Review code",
    "priority": "medium"
  }'
```

### 5. View Tasks

```bash
# All tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by priority
curl -X GET "http://localhost:3000/api/tasks?priority=high" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Filter by status
curl -X GET "http://localhost:3000/api/tasks?status=todo" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Search
curl -X GET "http://localhost:3000/api/tasks?search=report" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Update Task Status

```bash
curl -X PATCH http://localhost:3000/api/tasks/TASK_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "in-progress"
  }'
```

### 7. Get Statistics

```bash
curl -X GET http://localhost:3000/api/tasks/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response**:
```json
{
  "total": 10,
  "overdue": 2,
  "byStatus": {
    "todo": 4,
    "in-progress": 3,
    "completed": 3
  },
  "byPriority": {
    "high": 2,
    "medium": 5,
    "low": 3
  }
}
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
sudo netstat -tlnp | grep :3000

# Option 1: Kill the process
sudo kill PID

# Option 2: Change port in .env
# Edit .env and change API_GATEWAY_PORT=3000 to another port
```

### Services Won't Start

```bash
# View detailed logs
docker-compose logs

# Restart from scratch
docker-compose down
docker-compose up -d --build

# Check Docker is running
docker info
```

### Database Connection Failed

```bash
# Wait for databases to initialize (30-60 seconds)
docker-compose ps

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb

# Restart databases
docker-compose restart postgres mongodb
```

### Can't Access API

```bash
# Check services are running
docker-compose ps

# All should show "Up (healthy)"

# Test health endpoint
curl http://localhost:3000/health

# Check firewall
sudo ufw status
```

## 📚 Next Steps

1. **Read the Documentation**:
   - [API Documentation](API_DOCUMENTATION.md) - All endpoints
   - [Architecture](ARCHITECTURE.md) - System design
   - [Deployment](DEPLOYMENT.md) - Production deployment

2. **Customize**:
   - Update `.env` with your settings
   - Modify rate limits
   - Add custom endpoints
   - Extend services

3. **Integrate**:
   - Build a frontend (React, Vue, Angular)
   - Create a mobile app
   - Add webhooks
   - Integrate with other services

4. **Deploy**:
   - Setup SSL certificates
   - Configure domain
   - Deploy to cloud (AWS, Azure, GCP)
   - Setup monitoring

## 🛑 Cleanup

When you're done testing:

```bash
# Stop services (keeps data)
docker-compose down

# Remove everything including data
./scripts/cleanup.sh
```

## 💡 Pro Tips

1. **Use jq for JSON formatting**:
   ```bash
   curl ... | jq '.'
   ```

2. **Save your token**:
   ```bash
   export TOKEN="your_access_token_here"
   curl -H "Authorization: Bearer $TOKEN" ...
   ```

3. **Create aliases**:
   ```bash
   alias task-start='cd ~/taskManager && docker-compose up -d'
   alias task-stop='cd ~/taskManager && docker-compose down'
   alias task-logs='cd ~/taskManager && docker-compose logs -f'
   ```

4. **Watch logs in real-time**:
   ```bash
   docker-compose logs -f --tail=50
   ```

5. **Quick rebuild**:
   ```bash
   docker-compose up -d --build SERVICE_NAME
   ```

## 🎉 Success!

You now have a fully functional microservices-based task management system running!

**Happy Task Managing! 🚀**

---

Need help? Check the [full README](README.md) or [open an issue](https://github.com/yourusername/taskManager/issues).
