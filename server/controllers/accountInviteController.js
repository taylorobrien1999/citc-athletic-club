const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AccountInvite, User } = require('../models');

const SALT_ROUNDS = 12;

// ── GET /api/account-invites/:token ──────────────────────────────────────────
// Public — used by the "Create Your Account" page to confirm the token is
// valid and pre-fill the name before the person sets a password.
const getInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await AccountInvite.findOne({ where: { token } });

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found.' });
    }
    if (invite.used) {
      return res.status(400).json({ message: 'This invite has already been used.' });
    }
    if (new Date() > invite.expiresAt) {
      return res.status(400).json({ message: 'This invite link has expired.' });
    }

    return res.status(200).json({
      firstName: invite.firstName,
      lastName: invite.lastName,
      email: invite.email,
    });
  } catch (err) {
    console.error('Get invite error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/account-invites/:token/complete ────────────────────────────────
// Public — creates the real account once the person sets a password.
const completeInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const invite = await AccountInvite.findOne({ where: { token } });
    if (!invite) return res.status(404).json({ message: 'Invite not found.' });
    if (invite.used) return res.status(400).json({ message: 'This invite has already been used.' });
    if (new Date() > invite.expiresAt) return res.status(400).json({ message: 'This invite link has expired.' });

    const existing = await User.findOne({ where: { email: invite.email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists. Try logging in instead.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      firstName: invite.firstName,
      lastName: invite.lastName,
      email: invite.email,
      passwordHash,
      role: 'member',
    });

    invite.used = true;
    await invite.save();

    const jwtToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully.',
      token: jwtToken,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Complete invite error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getInvite, completeInvite };
