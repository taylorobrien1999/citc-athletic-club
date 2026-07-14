const express = require('express');
const router = express.Router();
const { getFeedback, updateFeedbackStatus } = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), getFeedback);
router.patch('/:id', authenticate, authorize('admin'), updateFeedbackStatus);

module.exports = router;