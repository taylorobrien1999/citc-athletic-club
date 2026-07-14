const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getResources);
router.post('/', authenticate, authorize('admin'), createResource);
router.delete('/:id', authenticate, authorize('admin'), deleteResource);

module.exports = router;