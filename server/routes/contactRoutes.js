const express = require('express');
const router = express.Router();
const { createMessage, getMessages, updateMessageStatus } = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/contact  (public — contact form)
router.post('/', createMessage);

// GET /api/contact  (admin only)
router.get('/', authenticate, authorize('admin'), getMessages);

// PATCH /api/contact/:id  (admin only)
router.patch('/:id', authenticate, authorize('admin'), updateMessageStatus);

module.exports = router;
