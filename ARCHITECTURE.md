# System Architecture Documentation

## Overview

The Task Management System is built using a microservices architecture pattern with the following key components:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                  (Web, Mobile, CLI, etc.)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │     Nginx      │
                    │ Reverse Proxy  │
                    │  Port 80/443   │
                    └────────┬───────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  API Gateway   │
                    │   Port 3000    │
                    └────────┬───────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Auth Service  │   │ User Service  │   │ Task Service  │
│  Port 3001    │   │  Port 3002    │   │  Port 3003    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                    │
        ▼                   ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  PostgreSQL   │   │  PostgreSQL   │   │   MongoDB     │
│  Port 5432    │   │  Port 5432    │   │  Port 27017   │
│  (Users DB)   │   │  (Users DB)   │   │  (Tasks DB)   │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Components

### 1. Nginx Reverse Proxy
**Purpose**: Entry point for all HTTP/HTTPS traffic

**Responsibilities**:
- SSL/TLS termination (production)
- Load balancing
- Rate limiting
- Request routing
- Security headers
- Static content serving

**Technology**: Nginx Alpine Docker image

**Configuration**:
- Gzip compression enabled
- Rate limiting: 10 requests/second
- Custom error pages
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

### 2. API Gateway
**Purpose**: Single entry point for all microservices

**Responsibilities**:
- Request routing to appropriate services
- Request/Response transformation
- Authentication header forwarding
- Centralized logging
- Rate limiting
- CORS handling

**Technology**: Node.js + Express + http-proxy-middleware

**Endpoints**:
- `/api/auth/*` → Auth Service
- `/api/users/*` → User Service
- `/api/tasks/*` → Task Service

**Port**: 3000

### 3. Auth Service
**Purpose**: User authentication and authorization

**Responsibilities**:
- User registration
- User login/logout
- JWT token generation and validation
- Refresh token management
- Password hashing (bcrypt)
- Token verification for other services

**Technology**: Node.js + Express + PostgreSQL

**Database Schema**:
```sql
users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token VARCHAR(500) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)
```

**Security Features**:
- JWT with 15-minute expiry
- Refresh tokens with 7-day expiry
- bcrypt password hashing (10 rounds)
- Input validation and sanitization
- Rate limiting

**Port**: 3001

### 4. User Service
**Purpose**: User profile management

**Responsibilities**:
- Get user profile
- Update user profile
- List all users (admin)
- Get user by ID (admin)
- Delete user (admin)

**Technology**: Node.js + Express + PostgreSQL

**Authentication**: Validates JWT tokens via Auth Service

**Database**: Shares PostgreSQL with Auth Service

**Authorization**:
- Regular users: Can only access their own profile
- Admin users: Can access all user data

**Port**: 3002

### 5. Task Service
**Purpose**: Task management operations

**Responsibilities**:
- Create tasks
- Read tasks (with filtering and pagination)
- Update tasks
- Delete tasks
- Update task status
- Get task statistics

**Technology**: Node.js + Express + MongoDB + Mongoose

**Database Schema** (MongoDB):
```javascript
{
  userId: Number,           // References user in PostgreSQL
  title: String,            // Max 200 chars
  description: String,      // Max 2000 chars
  status: String,          // todo, in-progress, completed, cancelled
  priority: String,        // low, medium, high, urgent
  dueDate: Date,
  tags: [String],
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- userId + createdAt (composite)
- userId + status (composite)
- userId + priority (composite)
- status
- priority

**Features**:
- Pagination
- Filtering by status and priority
- Search in title and description
- Task statistics
- Overdue task detection

**Port**: 3003

### 6. PostgreSQL Database
**Purpose**: Relational data storage

**Usage**:
- User accounts
- Authentication data
- Refresh tokens

**Version**: PostgreSQL 15 Alpine

**Configuration**:
- Persistent volume for data
- Health checks
- Indexed columns for performance

**Port**: 5432

### 7. MongoDB Database
**Purpose**: Document-oriented data storage

**Usage**:
- Task documents
- Flexible schema for task metadata

**Version**: MongoDB 7

**Configuration**:
- Persistent volume for data
- Health checks
- Authentication enabled
- Indexed collections

**Port**: 27017

## Data Flow

### User Registration Flow
```
Client → Nginx → API Gateway → Auth Service → PostgreSQL
                                      ↓
                                Generate JWT
                                      ↓
                          Store Refresh Token
                                      ↓
Client ← Nginx ← API Gateway ← Return Tokens
```

### Authenticated Request Flow
```
Client → Nginx → API Gateway → Service (User/Task)
                                      ↓
                              Verify JWT with Auth Service
                                      ↓
                              Process Request
                                      ↓
                              Access Database
                                      ↓
Client ← Nginx ← API Gateway ← Return Response
```

## Security Architecture

### 1. Network Security
- All services in isolated Docker network
- Only Nginx and API Gateway expose public ports
- Database ports exposed only for debugging (remove in production)

### 2. Authentication & Authorization
```
Layer 1: Nginx
  - Rate limiting
  - IP-based filtering
  - SSL/TLS termination

Layer 2: API Gateway
  - Rate limiting
  - CORS validation
  - Request logging

Layer 3: Services
  - JWT validation
  - Role-based access control
  - Input validation
```

### 3. Data Security
- Passwords hashed with bcrypt (10 rounds)
- JWT secrets stored in environment variables
- Database credentials in environment variables
- SQL parameterized queries (prevent SQL injection)
- Input sanitization (prevent XSS)

### 4. API Security
- Rate limiting: 100 requests per 15 minutes
- Request size limits
- CORS with allowed origins
- Security headers (Helmet.js)
- Input validation (express-validator)

## Scalability

### Horizontal Scaling
```yaml
# Scale specific services
docker-compose up -d --scale task-service=3
docker-compose up -d --scale api-gateway=2
```

### Load Balancing
- Nginx can load balance across multiple API Gateway instances
- API Gateway can distribute requests to multiple service instances

### Database Scaling
- PostgreSQL: Read replicas, connection pooling
- MongoDB: Replica sets, sharding

## High Availability

### Service Level
- Automatic container restart (restart: unless-stopped)
- Health checks on all services
- Graceful degradation

### Database Level
- Persistent volumes for data durability
- Regular backups (implement backup scripts)
- Database replication (production)

## Monitoring & Logging

### Health Checks
All services expose `/health` endpoint:
```bash
GET http://service:port/health

Response:
{
  "status": "healthy",
  "service": "service-name",
  "timestamp": "2026-02-28T10:00:00.000Z"
}
```

### Logging Levels
- Nginx: Access and error logs
- API Gateway: Morgan (HTTP request logging)
- Services: Console logging with timestamps

### Monitoring Points
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f [service-name]

# Check resource usage
docker stats

# Database connections
docker-compose exec postgres psql -U taskuser -d taskmanager -c "SELECT count(*) FROM pg_stat_activity;"
```

## Deployment

### Development
```bash
docker-compose up -d
```

### Production
1. Update environment variables with production values
2. Configure SSL certificates in Nginx
3. Remove debug ports from docker-compose.yml
4. Enable HTTPS redirect
5. Implement database backups
6. Setup monitoring and alerting
7. Use Docker secrets for sensitive data

### Environment-Specific Configurations
```
Development:
- Debug logging enabled
- All ports exposed
- Hot reload enabled

Staging:
- Production-like configuration
- Limited port exposure
- SSL enabled

Production:
- Minimal logging
- Only Nginx ports exposed
- SSL/TLS enforced
- Database backups
- Monitoring enabled
```

## Performance Optimization

### Database
- Indexed columns for frequent queries
- Connection pooling
- Query optimization

### Caching (Future Enhancement)
- Redis for session storage
- API response caching
- Database query caching

### API Gateway
- Request compression (gzip)
- Connection keep-alive
- Response buffering

## Disaster Recovery

### Backup Strategy
```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U taskuser taskmanager > backup.sql

# MongoDB backup
docker-compose exec mongodb mongodump --username taskuser --password taskpass --authenticationDatabase admin

# Restore PostgreSQL
docker-compose exec -T postgres psql -U taskuser -d taskmanager < backup.sql

# Restore MongoDB
docker-compose exec mongodb mongorestore --username taskuser --password taskpass --authenticationDatabase admin
```

### Service Recovery
```bash
# Restart failed service
docker-compose restart [service-name]

# Recreate service
docker-compose up -d --force-recreate [service-name]

# Full system restart
docker-compose down
docker-compose up -d
```

## Future Enhancements

1. **Caching Layer**: Add Redis for session and response caching
2. **Message Queue**: RabbitMQ/Kafka for async operations
3. **Service Mesh**: Istio for advanced traffic management
4. **API Versioning**: Support multiple API versions
5. **GraphQL Gateway**: Alternative to REST
6. **WebSocket Support**: Real-time updates
7. **Event Sourcing**: Event-driven architecture
8. **Metrics**: Prometheus + Grafana
9. **Tracing**: Jaeger for distributed tracing
10. **CI/CD**: Automated testing and deployment
