const express = require('express');
const router = express.Router();
const { upload, uploadFile } = require('../controllers/uploadController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/upload  (any logged-in user — members upload profile photos, admins upload site content)
router.post('/', authenticate, authorize('member', 'admin'), upload.single('file'), uploadFile);

module.exports = router;
