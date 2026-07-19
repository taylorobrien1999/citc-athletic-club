const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/events  (public — members and guests can read)
router.get('/', getEvents);

// POST /api/events  (admin only)
router.post('/', authenticate, authorize('admin'), createEvent);

// DELETE /api/events/:id  (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteEvent);

module.exports = router;
