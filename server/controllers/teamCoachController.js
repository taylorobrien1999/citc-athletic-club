const { TeamCoach } = require('../models');

// ── GET /api/team-coaches ────────────────────────────────────────────────────
const getTeamCoaches = async (req, res) => {
  try {
    const coaches = await TeamCoach.findAll({
      order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    return res.status(200).json({ coaches });
  } catch (err) {
    console.error('Get team coaches error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/team-coaches ───────────────────────────────────────────────────
// Admin only.
const createTeamCoach = async (req, res) => {
  try {
    const { name, role, photoUrl, homepageSummary, fullBio, qualifications, displayOrder } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    const coach = await TeamCoach.create({
      name, role, photoUrl, homepageSummary, fullBio, qualifications,
      displayOrder: displayOrder || 0,
    });
    return res.status(201).json({ coach });
  } catch (err) {
    console.error('Create team coach error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/team-coaches/:id ───────────────────────────────────────────────
// Admin only.
const updateTeamCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await TeamCoach.findByPk(id);
    if (!coach) return res.status(404).json({ message: 'Coach not found.' });

    const { name, role, photoUrl, homepageSummary, fullBio, qualifications, displayOrder } = req.body;
    if (name !== undefined) coach.name = name;
    if (role !== undefined) coach.role = role;
    if (photoUrl !== undefined) coach.photoUrl = photoUrl;
    if (homepageSummary !== undefined) coach.homepageSummary = homepageSummary;
    if (fullBio !== undefined) coach.fullBio = fullBio;
    if (qualifications !== undefined) coach.qualifications = qualifications;
    if (displayOrder !== undefined) coach.displayOrder = displayOrder;
    await coach.save();

    return res.status(200).json({ coach });
  } catch (err) {
    console.error('Update team coach error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/team-coaches/:id ──────────────────────────────────────────────
// Admin only.
const deleteTeamCoach = async (req, res) => {
  try {
    const { id } = req.params;
    const coach = await TeamCoach.findByPk(id);
    if (!coach) return res.status(404).json({ message: 'Coach not found.' });
    await coach.destroy();
    return res.status(200).json({ message: 'Coach deleted.' });
  } catch (err) {
    console.error('Delete team coach error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getTeamCoaches, createTeamCoach, updateTeamCoach, deleteTeamCoach };
