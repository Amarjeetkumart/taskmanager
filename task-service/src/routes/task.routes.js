const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
} = require('../controllers/task.controller');

const router = express.Router();

// Rate limiting
const taskLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Validation rules
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateStatusValidation = [
  body('status')
    .isIn(['todo', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be todo, in-progress, completed, or cancelled')
];

// All routes require authentication
router.use(authenticate);

// Task routes
router.post('/', taskLimiter, createTaskValidation, createTask);
router.get('/', taskLimiter, getTasks);
router.get('/stats', taskLimiter, getTaskStats);
router.get('/:id', taskLimiter, getTaskById);
router.put('/:id', taskLimiter, updateTaskValidation, updateTask);
router.patch('/:id/status', taskLimiter, updateStatusValidation, updateTaskStatus);
router.delete('/:id', taskLimiter, deleteTask);

module.exports = router;
