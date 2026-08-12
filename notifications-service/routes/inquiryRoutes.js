const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry } = require('../controllers/inquiryController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/inquiries  (public — guest inquiry form)
router.post('/', createInquiry);

// GET /api/inquiries  (admin only)
router.get('/', authenticate, authorize('admin'), getInquiries);

// PATCH /api/inquiries/:id  (admin only)
router.patch('/:id', authenticate, authorize('admin'), updateInquiryStatus);

// DELETE /api/inquiries/:id  (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteInquiry);

module.exports = router;
