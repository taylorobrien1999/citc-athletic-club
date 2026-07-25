const { Sponsor } = require('../models');

// ── GET /api/sponsors ──────────────────────────────────────────────────────────
// Public.
const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.findAll({ order: [['displayOrder', 'ASC'], ['name', 'ASC']] });
    return res.status(200).json({ sponsors });
  } catch (err) {
    console.error('Get sponsors error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/sponsors ─────────────────────────────────────────────────────────
// Admin only.
const createSponsor = async (req, res) => {
  try {
    const { name, logoUrl, websiteUrl, displayOrder } = req.body;
    if (!name || !logoUrl) {
      return res.status(400).json({ message: 'Name and logo are required.' });
    }
    const sponsor = await Sponsor.create({ name, logoUrl, websiteUrl, displayOrder });
    return res.status(201).json({ sponsor });
  } catch (err) {
    console.error('Create sponsor error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/sponsors/:id ────────────────────────────────────────────────────
// Admin only.
const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);
    if (!sponsor) return res.status(404).json({ message: 'Sponsor not found.' });

    const { name, logoUrl, websiteUrl, displayOrder } = req.body;
    if (name !== undefined) sponsor.name = name;
    if (logoUrl !== undefined) sponsor.logoUrl = logoUrl;
    if (websiteUrl !== undefined) sponsor.websiteUrl = websiteUrl;
    if (displayOrder !== undefined) sponsor.displayOrder = displayOrder;
    await sponsor.save();

    return res.status(200).json({ sponsor });
  } catch (err) {
    console.error('Update sponsor error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/sponsors/:id ────────────────────────────────────────────────────
// Admin only.
const deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsor.findByPk(id);
    if (!sponsor) return res.status(404).json({ message: 'Sponsor not found.' });

    await sponsor.destroy();
    return res.status(200).json({ message: 'Sponsor deleted.' });
  } catch (err) {
    console.error('Delete sponsor error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getSponsors, createSponsor, updateSponsor, deleteSponsor };
