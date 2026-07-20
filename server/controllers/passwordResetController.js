const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, PasswordResetToken } = require('../models');
const { sendMail } = require('../utils/mailer');

const SALT_ROUNDS = 12;

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
// Public. Always returns a generic success message, whether or not the email
// exists — this prevents leaking which emails have accounts.
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await PasswordResetToken.create({ userId: user.id, token, expiresAt });

      const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;

      try {
        await sendMail({
          to: user.email,
          subject: 'Reset Your CITC Password',
          html: `
            <p>Hi ${user.firstName},</p>
            <p>We received a request to reset your password. Click the link below to choose a new one:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <p>CITC</p>
            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
            <p style="color:#999;font-size:12px;">
              This is an automated message from an unmonitored mailbox — please do not reply directly to this email.
              For any questions, contact us at CalgaryInternationalTrackClub@gmail.com.
            </p>
          `,
        });
      } catch (mailErr) {
        console.error('Failed to send password reset email:', mailErr);
      }
    }

    return res.status(200).json({
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (err) {
    console.error('Request password reset error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── GET /api/auth/reset-password/:token ───────────────────────────────────────
// Public — confirms the token is valid before showing the reset form.
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const resetToken = await PasswordResetToken.findOne({ where: { token } });

    if (!resetToken) return res.status(404).json({ message: 'Invalid reset link.' });
    if (resetToken.used) return res.status(400).json({ message: 'This reset link has already been used.' });
    if (new Date() > resetToken.expiresAt) return res.status(400).json({ message: 'This reset link has expired.' });

    return res.status(200).json({ valid: true });
  } catch (err) {
    console.error('Validate reset token error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/auth/reset-password/:token ──────────────────────────────────────
// Public — sets the new password.
const completePasswordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const resetToken = await PasswordResetToken.findOne({ where: { token } });
    if (!resetToken) return res.status(404).json({ message: 'Invalid reset link.' });
    if (resetToken.used) return res.status(400).json({ message: 'This reset link has already been used.' });
    if (new Date() > resetToken.expiresAt) return res.status(400).json({ message: 'This reset link has expired.' });

    const user = await User.findByPk(resetToken.userId);
    if (!user) return res.status(404).json({ message: 'Account not found.' });

    user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await user.save();

    resetToken.used = true;
    await resetToken.save();

    return res.status(200).json({ message: 'Password updated. You can now log in.' });
  } catch (err) {
    console.error('Complete password reset error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { requestPasswordReset, validateResetToken, completePasswordReset };
