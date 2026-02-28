# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-28

### Added

#### Core Services
- **Auth Service**: Complete JWT-based authentication system
  - User registration with email and password
  - User login with JWT token generation
  - Refresh token mechanism (7-day expiry)
  - Token verification endpoint for microservices
  - Secure password hashing with bcrypt (10 rounds)
  - PostgreSQL database for user storage

- **User Service**: User profile management
  - Get current user profile
  - Update user profile (username, first name, last name)
  - Admin endpoints for user management
  - List all users with pagination and search
  - Get user by ID
  - Delete user (admin only)

- **Task Service**: Complete task management system
  - Create tasks with title, description, priority, due date, and tags
  - Get all tasks with filtering, pagination, and search
  - Update tasks
  - Update task status with completion tracking
  - Delete tasks
  - Task statistics (by status, priority, overdue count)
  - MongoDB database with optimized indexes

- **API Gateway**: Centralized routing and traffic management
  - Routes requests to appropriate microservices
  - Rate limiting (100 requests per 15 minutes)
  - CORS configuration
  - Request logging with Morgan
  - Health check aggregation

- **Nginx Reverse Proxy**: Production-ready web server
  - HTTP request handling
  - Rate limiting (10 req/s)
  - Security headers
  - Gzip compression
  - SSL/TLS ready configuration
  - Custom error pages

#### Security Features
- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Input validation using express-validator
- SQL injection prevention with parameterized queries
- XSS protection
- CORS configuration
- Helmet.js security headers
- Rate limiting on all services
- Non-root Docker containers
- Container health checks

#### Database
- **PostgreSQL 15**: User and authentication data
  - Users table with indexes
  - Refresh tokens table
  - Automatic timestamp tracking
  - Foreign key constraints

- **MongoDB 7**: Task document storage
  - Flexible task schema
  - Multiple indexes for performance
  - Aggregation for statistics

#### DevOps
- **Docker Containerization**:
  - Individual Dockerfile for each service
  - Multi-stage builds with Alpine Linux
  - Non-root user execution
  - Health check integration

- **Docker Compose Orchestration**:
  - Service dependency management
  - Health check-based startup ordering
  - Persistent volumes for databases
  - Isolated network
  - Environment variable configuration

#### Documentation
- Comprehensive README.md with quick start guide
- API_DOCUMENTATION.md with all endpoints
- ARCHITECTURE.md with system design details
- DEPLOYMENT.md with production deployment guide
- CONTRIBUTING.md with contribution guidelines
- Inline code documentation

#### Scripts
- `setup.sh`: Automated setup and deployment
- `cleanup.sh`: System cleanup and data removal
- `test-api.sh`: Comprehensive API testing
- `init-mongo.js`: MongoDB initialization

#### Configuration
- Environment variable templates
- .gitignore for security
- Docker network configuration
- Service port configuration
- Rate limiting configuration

### Features by Service

#### Auth Service (Port 3001)
- POST /auth/register - Register new user
- POST /auth/login - Authenticate user
- POST /auth/refresh - Refresh access token
- POST /auth/logout - Invalidate refresh token
- POST /auth/verify - Verify JWT token (internal)

#### User Service (Port 3002)
- GET /users/me - Get current user profile
- PUT /users/me - Update profile
- GET /users/:id - Get user by ID (admin)
- GET /users - List all users (admin)
- DELETE /users/:id - Delete user (admin)

#### Task Service (Port 3003)
- POST /tasks - Create task
- GET /tasks - Get all tasks (with filters)
- GET /tasks/stats - Get task statistics
- GET /tasks/:id - Get task by ID
- PUT /tasks/:id - Update task
- PATCH /tasks/:id/status - Update task status
- DELETE /tasks/:id - Delete task

#### API Gateway (Port 3000)
- All routes proxied with /api prefix
- GET /health - Health check
- GET /api - API information

#### Nginx (Port 80/443)
- Reverse proxy to API Gateway
- Static file serving ready
- SSL/TLS termination ready

### Technical Stack

#### Backend
- Node.js 18
- Express.js 4.18
- PostgreSQL 15
- MongoDB 7
- Mongoose 8

#### Security
- jsonwebtoken 9.0
- bcryptjs 2.4
- helmet 7.1
- express-rate-limit 7.1
- express-validator 7.0

#### DevOps
- Docker 20.10+
- Docker Compose 2.0+
- Nginx Alpine
- Node Alpine images

### Infrastructure
- Microservices architecture
- RESTful API design
- JWT-based authentication
- Docker containerization
- Reverse proxy pattern
- Database per service pattern
- API Gateway pattern

### Performance Optimizations
- Database indexing (PostgreSQL and MongoDB)
- Connection keep-alive
- Gzip compression
- Response buffering
- Efficient Docker images (Alpine)

### Monitoring & Operations
- Health check endpoints on all services
- Docker health checks
- Structured logging
- Error handling middleware
- Request/response logging

---

## Future Enhancements (Planned)

### Version 1.1.0 (Planned)
- [ ] Redis caching layer
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] File upload for tasks
- [ ] Task comments
- [ ] Task assignments
- [ ] Real-time updates with WebSockets

### Version 1.2.0 (Planned)
- [ ] Automated testing (Jest, Mocha)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Elasticsearch logging
- [ ] API rate limiting per user
- [ ] GraphQL API option

### Version 2.0.0 (Planned)
- [ ] Event-driven architecture
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Service mesh (Istio)
- [ ] Kubernetes deployment
- [ ] Multi-tenancy support
- [ ] Advanced analytics
- [ ] Mobile app integration

---

[1.0.0]: https://github.com/yourusername/taskManager/releases/tag/v1.0.0
