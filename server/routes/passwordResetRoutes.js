const express = require('express');
const router = express.Router();
const { requestPasswordReset, validateResetToken, completePasswordReset } = require('../controllers/passwordResetController');

router.post('/forgot-password', requestPasswordReset);
router.get('/reset-password/:token', validateResetToken);
router.post('/reset-password/:token', completePasswordReset);

module.exports = router;
