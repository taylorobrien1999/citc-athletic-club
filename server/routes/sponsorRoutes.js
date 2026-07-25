const express = require('express');
const router = express.Router();
const { getSponsors, createSponsor, updateSponsor, deleteSponsor } = require('../controllers/sponsorController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getSponsors);
router.post('/', authenticate, authorize('admin'), createSponsor);
router.patch('/:id', authenticate, authorize('admin'), updateSponsor);
router.delete('/:id', authenticate, authorize('admin'), deleteSponsor);

module.exports = router;
