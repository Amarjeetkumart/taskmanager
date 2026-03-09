# Getting Started with Task Manager

Complete guide to set up and use the Task Manager application with frontend UI.

## 📋 Table of Contents

1. [Quick Start (Recommended)](#quick-start)
2. [Manual Setup](#manual-setup)
3. [Using the Frontend](#using-the-frontend)
4. [Development Mode](#development-mode)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Step 1: Prerequisites

- Docker and Docker Compose installed
- 4GB RAM and 10GB disk space available
- Ports 3000-3003, 5173, 8080 available

### Step 2: Clone and Setup

```bash
cd taskManager
cp .env.example .env
```

### Step 3: Start Everything

```bash
# Start all services including frontend (Docker Compose V2)
docker compose up --build -d

# Check status
docker compose ps

# Note: If you get "command not found", see DOCKER_COMPOSE_GUIDE.md
```

### Step 4: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000

---

## Manual Setup

### Backend Services

1. **Start Database Services**
   ```bash
   docker compose up -d postgres mongodb
   ```

2. **Wait for databases to be ready** (30 seconds)

3. **Start Backend Services**
   ```bash
   docker compose up -d auth-service user-service task-service api-gateway
   ```

4. **Verify Backend**
   ```bash
   curl http://localhost:3000/health
   ```

### Frontend

#### Option 1: Using Docker
```bash
docker compose up -d frontend
```
Access at http://localhost:5173

#### Option 2: Local Development
```bash
cd frontend
npm install
npm run dev
```
Access at http://localhost:5173

---

## Using the Frontend

### 1. First Time Setup

1. **Open the Application**
   - Navigate to http://localhost:5173
   - You'll see the landing page

2. **Create an Account**
   - Click "Get Started" or "Sign Up"
   - Fill in your details:
     - First Name
     - Last Name
     - Username
     - Email
     - Password (min 8 characters)
   - Click "Create Account"

3. **Automatic Login**
   - You'll be automatically logged in
   - Redirected to the dashboard

### 2. Dashboard Overview

The dashboard shows:
- **Total Tasks**: All your tasks
- **Completed**: Finished tasks
- **In Progress**: Active tasks
- **Overdue**: Past due date tasks
- **Priority Breakdown**: Tasks by priority level
- **Recent Tasks**: Your 5 most recent tasks

### 3. Managing Tasks

#### Create a Task
1. Click "New Task" button (top right) or in dashboard
2. Fill in task details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority**: Low, Medium, High, Urgent
   - **Status**: To Do, In Progress, Completed, Cancelled
   - **Due Date** (optional)
   - **Tags** (optional, comma-separated)
3. Click "Create Task"

#### View All Tasks
1. Click "Tasks" in navigation
2. Use filters:
   - Search by title/description
   - Filter by status
   - Filter by priority
3. See all tasks in a list view

#### Edit a Task
1. Go to task list or task detail
2. Click "Edit" button
3. Update any fields
4. Click "Update Task"

#### Delete a Task
1. Go to task list or task detail
2. Click "Delete" button
3. Confirm deletion

#### Quick Status Update
- In task list, use the dropdown to quickly change status
- Or go to task detail and click status buttons

### 4. User Profile

1. Click "Profile" in navigation
2. View your information:
   - Name and username
   - Email
   - Role
   - Member since date
3. Click "Edit Profile" to update:
   - First name
   - Last name
   - Username
   - (Email cannot be changed)

### 5. Admin Features (Admin Users Only)

If you have admin role:
1. Click "Admin" in navigation
2. View all users in the system
3. Search users
4. Delete users (except admins)
5. See user statistics

---

## Development Mode

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Features:
- Hot module replacement (instant updates)
- React DevTools support
- Source maps for debugging

### Backend Development

Each service can be run separately:

```bash
# Auth Service
cd auth-service
npm install
npm run dev

# User Service
cd user-service
npm install
npm run dev

# Task Service
cd task-service
npm install
npm run dev

# API Gateway
cd api-gateway
npm install
npm run dev
```

### Development URLs

- Frontend: http://localhost:5173
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002
- Task Service: http://localhost:3003

---

## Production Deployment

### Using Docker Compose (Recommended)

```bash
# Build optimized images
docker compose build --no-cache

# Start in production mode
docker compose up -d
```

### Individual Deployment

#### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting (Netlify, Vercel, etc.)
```

#### Backend
Deploy using Docker containers or your preferred cloud platform:
- AWS EC2/ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## Troubleshooting

### Frontend Issues

**Problem**: White screen or errors
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Problem**: API calls failing
- Check backend is running: `curl http://localhost:3000/health`
- Check Vite proxy config in `vite.config.js`
- Look at browser console for CORS errors

**Problem**: Styles not working
```bash
# Rebuild Tailwind
cd frontend
npm run dev
```

### Backend Issues

**Problem**: Services not starting
```bash
# Check logs
docker compose logs -f [service-name]

# Restart specific service
docker compose restart [service-name]
```

**Problem**: Database connection errors
```bash
# Check database health
docker compose ps

# Restart databases
docker compose restart postgres mongodb
```

**Problem**: Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 [PID]
```

### Common Solutions

1. **Reset Everything**
   ```bash
   docker compose down -v
   docker compose up --build -d
   ```

2. **View All Logs**
   ```bash
   docker compose logs -f
   ```

3. **Clean Docker**
   ```bash
   docker system prune -a
   docker volume prune
   ```

---

## Next Steps

1. **Explore Features**: Try creating different types of tasks
2. **Test Filters**: Use search and filter options
3. **Check Admin Panel**: If you're an admin, explore user management
4. **Review Documentation**: Check API_DOCUMENTATION.md for API details
5. **Customize**: Modify colors in `tailwind.config.js`

---

## Support

- **Documentation**: See README.md and other docs
- **API Reference**: API_DOCUMENTATION.md
- **Architecture**: ARCHITECTURE.md
- **Contributing**: CONTRIBUTING.md

---

## Features Checklist

### ✅ Implemented Features

- [x] User registration and login
- [x] JWT authentication with refresh tokens
- [x] Dashboard with statistics
- [x] Create, read, update, delete tasks
- [x] Task prioritization (low, medium, high, urgent)
- [x] Task status management (to-do, in-progress, completed, cancelled)
- [x] Due date tracking
- [x] Overdue task highlighting
- [x] Tag support
- [x] Search and filter tasks
- [x] User profile management
- [x] Admin user management
- [x] Responsive design
- [x] Toast notifications
- [x] Protected routes
- [x] Automatic token refresh
- [x] Error handling
- [x] Loading states
- [x] Beautiful UI with Tailwind CSS

---

**Happy Task Managing! 🎉**
