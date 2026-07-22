const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/announcements  (public — members and guests can read)
router.get('/', getAnnouncements);

// POST /api/announcements  (admin only)
router.post('/', authenticate, authorize('admin'), createAnnouncement);

// PATCH /api/announcements/:id  (admin only)
router.patch('/:id', authenticate, authorize('admin'), updateAnnouncement);

// DELETE /api/announcements/:id  (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteAnnouncement);

module.exports = router;
