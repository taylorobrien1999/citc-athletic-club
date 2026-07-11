const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/events  (public — members and guests can read)
router.get('/', getEvents);

// POST /api/events  (admin only)
router.post('/', authenticate, authorize('admin'), createEvent);

module.exports = router;
