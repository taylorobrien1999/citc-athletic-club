const { User } = require('../models');

// ── GET /api/members ───────────────────────────────────────────────────────────
// Admin only — list all member accounts (not admins), newest first.
const getMembers = async (req, res) => {
  try {
    const members = await User.findAll({
      where: { role: 'member' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'phone', 'emergencyContactName', 'emergencyContactRelation', 'emergencyContactPhone', 'profilePictureUrl', 'dateOfBirth', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ members });
  } catch (err) {
    console.error('Get members error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/members/:id ─────────────────────────────────────────────────────
// Admin only — toggle isActive (deactivate/reactivate). Blocks login without
// deleting the account or any related data.
const toggleMemberActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be true or false.' });
    }

    const member = await User.findOne({ where: { id, role: 'member' } });
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    member.isActive = isActive;
    await member.save();

    return res.status(200).json({ message: 'Member updated.', member });
  } catch (err) {
    console.error('Toggle member active error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/members/:id ────────────────────────────────────────────────────
// Admin only — permanently deletes the account. Use with care; deactivating
// is the safer, reversible option for most cases.
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findOne({ where: { id, role: 'member' } });
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    await member.destroy();
    return res.status(200).json({ message: 'Member deleted.' });
  } catch (err) {
    console.error('Delete member error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/members/:id/promote ────────────────────────────────────────────
// Admin only — grants a member account admin access. One-way in this UI;
// use direct DB access to demote if that's ever needed (rare, high-stakes action).
const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findOne({ where: { id, role: 'member' } });
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    member.role = 'admin';
    await member.save();

    return res.status(200).json({ message: 'Member promoted to admin.', member });
  } catch (err) {
    console.error('Promote to admin error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── GET /api/members/admins ────────────────────────────────────────────────────
// Admin only — list all admin accounts.
const getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'firstName', 'lastName', 'email', 'isActive', 'isSuperAdmin', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ admins });
  } catch (err) {
    console.error('Get admins error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/members/:id/demote ─────────────────────────────────────────────
// Admin only — removes admin access, back to a regular member account.
// Blocked from demoting yourself, to prevent accidental lockout.
const demoteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ message: "You can't demote your own account." });
    }

    const admin = await User.findOne({ where: { id, role: 'admin' } });
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    if (admin.isSuperAdmin) {
      return res.status(403).json({ message: 'This account is protected and cannot be demoted.' });
    }

    admin.role = 'member';
    await admin.save();

    return res.status(200).json({ message: 'Admin demoted to member.', admin });
  } catch (err) {
    console.error('Demote admin error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getMembers, toggleMemberActive, deleteMember, promoteToAdmin, getAdmins, demoteAdmin };
