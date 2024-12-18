// routes/auth.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each user to 5 login attempts per windowMs
    message: 'Too many login attempts. Please try again later.'
});

// Login Route
router.post('/login', loginLimiter, authController.login);

// Register Route
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email format.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one number.')
        .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter.'),
], authController.register);

// Verify Email Route
router.get('/verify-email/:id', authController.verifyEmail);

// Google Auth Routes
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleCallback);

// Success Route
router.get('/success', authController.success);

module.exports = router;
