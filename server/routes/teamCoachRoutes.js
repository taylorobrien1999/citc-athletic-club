const express = require('express');
const router = express.Router();
const { getTeamCoaches, createTeamCoach, updateTeamCoach, deleteTeamCoach } = require('../controllers/teamCoachController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getTeamCoaches);
router.post('/', authenticate, authorize('admin'), createTeamCoach);
router.patch('/:id', authenticate, authorize('admin'), updateTeamCoach);
router.delete('/:id', authenticate, authorize('admin'), deleteTeamCoach);

module.exports = router;
