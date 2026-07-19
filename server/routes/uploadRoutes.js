const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/upload  (admin only)
router.post('/', authenticate, authorize('admin'), upload.single('file'), uploadFile);

module.exports = router;
