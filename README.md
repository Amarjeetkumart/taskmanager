# Secure Microservices-Based Task Management System

A production-ready, secure task management system built with microservices architecture and Docker containerization.

> **📝 Note**: If you get `docker-compose: command not found`, use `docker compose` (space) instead of `docker-compose` (hyphen). See [DOCKER_COMPOSE_GUIDE.md](DOCKER_COMPOSE_GUIDE.md) for details.

## 🏗️ Architecture Overview

This system consists of the following microservices:

- **Frontend**: Modern React application with Tailwind CSS (Port 5173)
- **API Gateway**: Entry point for all client requests (Port 3000)
- **Auth Service**: Handles authentication and JWT token management (Port 3001)
- **User Service**: Manages user information and profiles (Port 3002)
- **Task Service**: CRUD operations for tasks (Port 3003)
- **PostgreSQL**: Primary database for users and authentication
- **MongoDB**: Database for tasks
- **Nginx**: Reverse proxy with SSL termination and load balancing (Port 8080/8443)

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Helmet.js security headers
- Environment variable management
- Container security best practices

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Node.js 18+ (for local development)
- Git

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Navigate to project directory
cd taskManager

# Copy environment files
cp .env.example .env
```

### 2. Start All Services

```bash
# Build and start all services (Modern syntax - Docker Compose V2)
docker compose up --build

# Or run in detached mode
docker compose up -d --build

# Legacy syntax (if using old docker-compose)
docker-compose up -d --build
```

### 3. Verify Services

Check that all services are running:

```bash
docker compose ps

# Or with legacy syntax
docker-compose ps
```

### 4. Access the Application

- **Frontend Application**: http://localhost:5173
- **API Gateway**: http://localhost:3000
- **Nginx Reverse Proxy**: http://localhost:8080

## 🎨 Frontend Features

The frontend is a modern React application with:

- **Authentication**: Login, Register, and Protected Routes
- **Dashboard**: Overview with task statistics and charts
- **Task Management**: Create, view, edit, delete tasks with advanced filtering
- **User Profile**: View and edit user information
- **Admin Panel**: User management (admin only)
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Instant feedback with toast notifications

### Frontend Development

For local frontend development:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start at http://localhost:5173 with hot module replacement.

## 📡 API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/refresh      - Refresh access token
POST   /api/auth/logout       - Logout user
```

### User Endpoints (Protected)

```
GET    /api/users/me          - Get current user profile
PUT    /api/users/me          - Update user profile
GET    /api/users/:id         - Get user by ID (Admin)
GET    /api/users             - List all users (Admin)
```

### Task Endpoints (Protected)

```
POST   /api/tasks             - Create new task
GET    /api/tasks             - Get all tasks for user
GET    /api/tasks/:id         - Get specific task
PUT    /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
PATCH  /api/tasks/:id/status  - Update task status
```

## 🧪 Testing the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Create a Task (Use token from login response)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README",
    "priority": "high",
    "dueDate": "2026-03-15"
  }'
```

### Get Tasks

```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🗂️ Project Structure

```
taskManager/
├── api-gateway/           # API Gateway service
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── auth-service/          # Authentication service
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── user-service/          # User management service
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── task-service/          # Task management service
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── nginx/                 # Nginx reverse proxy
│   ├── nginx.conf
│   └── Dockerfile
├── scripts/               # Utility scripts
│   ├── setup.sh
│   └── cleanup.sh
├── docker-compose.yml     # Docker orchestration
├── .env.example           # Environment variables template
└── README.md
```

## 🛠️ Development

### Running Individual Services

```bash
# Start only databases
docker-compose up postgres mongodb

# Start specific service
docker-compose up auth-service

# View logs
docker-compose logs -f task-service
```

### Rebuilding Services

```bash
# Rebuild single service
docker-compose up -d --build auth-service

# Rebuild all services
docker-compose up -d --build
```

### Database Access

```bash
# PostgreSQL
docker-compose exec postgres psql -U taskuser -d taskmanager

# MongoDB
docker-compose exec mongodb mongosh -u taskuser -p taskpass --authenticationDatabase admin
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example`):

- `JWT_SECRET`: Secret key for JWT signing
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens
- `POSTGRES_PASSWORD`: PostgreSQL database password
- `MONGODB_PASSWORD`: MongoDB database password
- `NODE_ENV`: Environment (development/production)

### Security Configuration

- JWT tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Rate limiting: 100 requests per 15 minutes
- CORS enabled for specified origins only

## 📊 Monitoring

### Health Checks

```bash
# Check all services health
curl http://localhost:3000/health

# Individual service health
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # User
curl http://localhost:3003/health  # Task
```

### Container Stats

```bash
docker stats
```

## 🧹 Cleanup

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# Remove all containers, networks, and images
docker-compose down --rmi all -v
```

## 🔐 Production Deployment

### SSL/TLS Setup

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Update nginx configuration with certificate paths
3. Redirect HTTP to HTTPS

### Security Hardening

- Use strong, unique passwords for all services
- Rotate JWT secrets regularly
- Enable container security scanning
- Implement network segmentation
- Use secrets management (Docker Secrets or Vault)
- Enable audit logging
- Regular security updates

### Scaling

```bash
# Scale task service to 3 instances
docker-compose up -d --scale task-service=3

# Scale with load balancer
docker-compose up -d --scale task-service=3 --scale api-gateway=2
```

## 🐛 Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Verify ports are available
sudo netstat -tlnp | grep -E ':(3000|3001|3002|3003|5432|27017|80)'

# Reset everything
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues

```bash
# Verify database is running
docker-compose ps postgres mongodb

# Check database logs
docker-compose logs postgres
docker-compose logs mongodb
```

## 📝 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, PostgreSQL, MongoDB, and Docker**
