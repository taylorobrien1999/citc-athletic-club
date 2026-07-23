const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/events  (public — members and guests can read)
router.get('/', getEvents);

// POST /api/events  (admin only)
router.post('/', authenticate, authorize('admin'), createEvent);

// PATCH /api/events/:id  (admin only)
router.patch('/:id', authenticate, authorize('admin'), updateEvent);

// DELETE /api/events/:id  (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteEvent);

module.exports = router;
