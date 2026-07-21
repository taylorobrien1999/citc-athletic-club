const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SALT_ROUNDS = 12;

// ── POST /api/auth/register ──────────────────────────────────────────────────
// Public sign-up always creates a 'member'. Admin accounts are seeded manually.
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: 'member', // always member on public sign-up
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: sanitize(user),
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'This account has been deactivated. Please contact CITC.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: sanitize(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({ user: sanitize(user) });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sanitize(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    emergencyContactName: user.emergencyContactName,
    emergencyContactRelation: user.emergencyContactRelation,
    emergencyContactPhone: user.emergencyContactPhone,
    profilePictureUrl: user.profilePictureUrl,
    dateOfBirth: user.dateOfBirth,
    createdAt: user.createdAt,
  };
}

// ── PATCH /api/auth/me ─────────────────────────────────────────────────────────
// Any logged-in user can update their own profile. Email is intentionally
// never editable here — only firstName, lastName, phone, emergency contact,
// and profile picture. req.user.id (from the JWT) is the only record touched.
const updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const { firstName, lastName, phone, emergencyContactName, emergencyContactRelation, emergencyContactPhone, profilePictureUrl } = req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (emergencyContactName !== undefined) user.emergencyContactName = emergencyContactName;
    if (emergencyContactRelation !== undefined) user.emergencyContactRelation = emergencyContactRelation;
    if (emergencyContactPhone !== undefined) user.emergencyContactPhone = emergencyContactPhone;
    if (profilePictureUrl !== undefined) user.profilePictureUrl = profilePictureUrl;

    await user.save();

    return res.status(200).json({ message: 'Profile updated.', user: sanitize(user) });
  } catch (err) {
    console.error('Update me error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getMe, updateMe };
