const express = require('express');
const router = express.Router();
const { proxyChat } = require('../controllers/chatProxyController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/chat  (public — used by the public FAQ widget)
router.post('/', proxyChat);

// POST /api/chat/admin  (admin only — used by the admin CMS-help assistant)
router.post('/admin', authenticate, authorize('admin'), proxyChat);

module.exports = router;