const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.API_GATEWAY_PORT || 3000;

// Logging
app.use(morgan('combined'));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';
const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://task-service:3003';

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'debug',
  timeout: 30000, // 30 second timeout
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'The service is temporarily unavailable'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward authentication headers
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  }
};

// Routes - MUST come before body parsing for proxy to work correctly

// Auth service routes
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
  pathRewrite: {
    '^/api/auth': '/auth'
  },
  ...proxyOptions
}));

// User service routes
app.use('/api/users', createProxyMiddleware({
  target: USER_SERVICE_URL,
  pathRewrite: {
    '^/api/users': '/users'
  },
  ...proxyOptions
}));

// Task service routes
app.use('/api/tasks', createProxyMiddleware({
  target: TASK_SERVICE_URL,
  pathRewrite: {
    '^/api/tasks': '/tasks'
  },
  ...proxyOptions
}));

// Body parsing - After proxy routes to avoid interfering with proxying
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: {
      auth: AUTH_SERVICE_URL,
      user: USER_SERVICE_URL,
      task: TASK_SERVICE_URL
    }
  });
});

// API info
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Task Management API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tasks: '/api/tasks'
    },
    documentation: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      refresh: 'POST /api/auth/refresh',
      logout: 'POST /api/auth/logout',
      getProfile: 'GET /api/users/me',
      updateProfile: 'PUT /api/users/me',
      listUsers: 'GET /api/users (Admin)',
      createTask: 'POST /api/tasks',
      getTasks: 'GET /api/tasks',
      getTask: 'GET /api/tasks/:id',
      updateTask: 'PUT /api/tasks/:id',
      updateTaskStatus: 'PATCH /api/tasks/:id/status',
      deleteTask: 'DELETE /api/tasks/:id',
      getStats: 'GET /api/tasks/stats'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📝 Services:`);
  console.log(`   Auth: ${AUTH_SERVICE_URL}`);
  console.log(`   User: ${USER_SERVICE_URL}`);
  console.log(`   Task: ${TASK_SERVICE_URL}`);
});

module.exports = app;
