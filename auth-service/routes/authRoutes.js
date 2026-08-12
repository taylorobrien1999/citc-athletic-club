const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (protected — requires valid JWT)
router.get('/me', authenticate, getMe);

// PATCH /api/auth/me  (protected — user can only update their own profile)
router.patch('/me', authenticate, updateMe);

module.exports = router;