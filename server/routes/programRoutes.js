const express = require('express');
const router = express.Router();
const { getPrograms, createProgram, updateProgram, deleteProgram } = require('../controllers/contentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getPrograms);
router.post('/', authenticate, authorize('admin'), createProgram);
router.patch('/:id', authenticate, authorize('admin'), updateProgram);
router.delete('/:id', authenticate, authorize('admin'), deleteProgram);

module.exports = router;