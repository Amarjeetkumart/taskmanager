const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  getMe,
  updateMe,
  getUserById,
  getAllUsers,
  deleteUser
} = require('../controllers/user.controller');

const router = express.Router();

// Rate limiting
const userLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Validation rules
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters')
];

// User routes (protected)
router.get('/me', userLimiter, authenticate, getMe);
router.put('/me', userLimiter, authenticate, updateProfileValidation, updateMe);

// Admin routes
router.get('/:id', userLimiter, authenticate, isAdmin, getUserById);
router.get('/', userLimiter, authenticate, isAdmin, getAllUsers);
router.delete('/:id', userLimiter, authenticate, isAdmin, deleteUser);

module.exports = router;
