const express = require('express');
const router = express.Router();
const { getInvite, completeInvite } = require('../controllers/accountInviteController');

router.get('/:token', getInvite);
router.post('/:token/complete', completeInvite);

module.exports = router;
