const express = require('express');
const router = express.Router();
const { getRecords, createRecord, updateRecord, deleteRecord } = require('../controllers/recordController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getRecords);
router.post('/', authenticate, authorize('admin'), createRecord);
router.patch('/:id', authenticate, authorize('admin'), updateRecord);
router.delete('/:id', authenticate, authorize('admin'), deleteRecord);

module.exports = router;
