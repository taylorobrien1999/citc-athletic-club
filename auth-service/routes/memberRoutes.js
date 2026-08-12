const express = require('express');
const router = express.Router();
const { getMembers, toggleMemberActive, deleteMember, promoteToAdmin, getAdmins, demoteAdmin } = require('../controllers/memberController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), getMembers);
router.get('/admins', authenticate, authorize('admin'), getAdmins);
router.patch('/:id', authenticate, authorize('admin'), toggleMemberActive);
router.patch('/:id/promote', authenticate, authorize('admin'), promoteToAdmin);
router.patch('/:id/demote', authenticate, authorize('admin'), demoteAdmin);
router.delete('/:id', authenticate, authorize('admin'), deleteMember);

module.exports = router;
