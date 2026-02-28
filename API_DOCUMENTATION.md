# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/auth/login`

Authenticate and get access tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Refresh Token
**POST** `/auth/refresh`

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Logout
**POST** `/auth/logout`

Invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get Current User Profile
**GET** `/users/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "createdAt": "2026-02-28T10:00:00.000Z",
  "updatedAt": "2026-02-28T10:00:00.000Z"
}
```

### Update User Profile
**PUT** `/users/me`

Update the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "username": "jane_smith"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "jane_smith",
    "email": "john@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "user",
    "updatedAt": "2026-02-28T11:00:00.000Z"
  }
}
```

### Get User by ID (Admin Only)
**GET** `/users/:id`

Get a specific user's profile (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
{
  "id": 2,
  "username": "user123",
  "email": "user@example.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "user",
  "isActive": true,
  "createdAt": "2026-02-28T09:00:00.000Z",
  "updatedAt": "2026-02-28T09:00:00.000Z"
}
```

### Get All Users (Admin Only)
**GET** `/users`

Get all users with pagination (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `search` (optional)

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-02-28T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Delete User (Admin Only)
**DELETE** `/users/:id`

Delete a user account (admin only).

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Task Endpoints

### Create Task
**POST** `/tasks`

Create a new task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API documentation",
  "priority": "high",
  "dueDate": "2026-03-15T00:00:00.000Z",
  "tags": ["documentation", "urgent"]
}
```

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "65f1234567890abcdef12345",
    "userId": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "tags": ["documentation", "urgent"],
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:00:00.000Z"
  }
}
```

### Get All Tasks
**GET** `/tasks`

Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (todo, in-progress, completed, cancelled)
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `sort` (optional, default: -createdAt)
- `search` (optional): Search in title and description

**Response (200):**
```json
{
  "tasks": [
    {
      "_id": "65f1234567890abcdef12345",
      "userId": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API documentation",
      "status": "todo",
      "priority": "high",
      "dueDate": "2026-03-15T00:00:00.000Z",
      "tags": ["documentation", "urgent"],
      "isOverdue": false,
      "createdAt": "2026-02-28T10:00:00.000Z",
      "updatedAt": "2026-02-28T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Task by ID
**GET** `/tasks/:id`

Get a specific task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "task": {
    "_id": "65f1234567890abcdef12345",
    "userId": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API documentation",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "tags": ["documentation", "urgent"],
    "isOverdue": false,
    "createdAt": "2026-02-28T10:00:00.000Z",
    "updatedAt": "2026-02-28T10:00:00.000Z"
  }
}
```

### Update Task
**PUT** `/tasks/:id`

Update a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "priority": "urgent",
  "tags": ["updated"]
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "_id": "65f1234567890abcdef12345",
    "userId": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "todo",
    "priority": "urgent",
    "tags": ["updated"],
    "updatedAt": "2026-02-28T11:00:00.000Z"
  }
}
```

### Update Task Status
**PATCH** `/tasks/:id/status`

Update only the task status.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "message": "Task status updated successfully",
  "task": {
    "_id": "65f1234567890abcdef12345",
    "status": "completed",
    "completedAt": "2026-02-28T11:00:00.000Z"
  }
}
```

### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### Get Task Statistics
**GET** `/tasks/stats`

Get statistics about user's tasks.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "total": 10,
  "overdue": 2,
  "byStatus": {
    "todo": 4,
    "in-progress": 3,
    "completed": 2,
    "cancelled": 1
  },
  "byPriority": {
    "low": 2,
    "medium": 3,
    "high": 1,
    "urgent": 1
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token or credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Returns 429 status when limit exceeded

## Security Features

1. **JWT Authentication**: Access tokens expire in 15 minutes
2. **Refresh Tokens**: Valid for 7 days
3. **Password Hashing**: bcrypt with configurable rounds
4. **Input Validation**: express-validator on all inputs
5. **CORS**: Configurable allowed origins
6. **Helmet.js**: Security headers
7. **Rate Limiting**: Per-IP request throttling
8. **SQL Injection Protection**: Parameterized queries
9. **XSS Protection**: Input sanitization
