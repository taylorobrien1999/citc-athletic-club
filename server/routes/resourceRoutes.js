const express = require('express');
const router = express.Router();
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getResources);
router.post('/', authenticate, authorize('admin'), createResource);
router.patch('/:id', authenticate, authorize('admin'), updateResource);
router.delete('/:id', authenticate, authorize('admin'), deleteResource);

module.exports = router;