const express = require('express');
const router = express.Router();
const { getAllContent, getAllContentAdmin, upsertContent } = require('../controllers/siteContentController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/site-content  (public — key:value map for pages to consume)
router.get('/', getAllContent);

// GET /api/site-content/admin  (admin only — full rows for the editor UI)
router.get('/admin', authenticate, authorize('admin'), getAllContentAdmin);

// PUT /api/site-content/:key  (admin only — create or update one entry)
router.put('/:key', authenticate, authorize('admin'), upsertContent);

module.exports = router;
