const { SiteContent } = require('../models');

// ── GET /api/site-content ──────────────────────────────────────────────────────
// Public — returns all overrides as a { key: value } map for easy lookup on the frontend.
const getAllContent = async (req, res) => {
  try {
    const rows = await SiteContent.findAll();
    const map = {};
    rows.forEach((row) => { map[row.contentKey] = row.value; });
    return res.status(200).json({ content: map });
  } catch (err) {
    console.error('Get site content error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── GET /api/site-content/admin ────────────────────────────────────────────────
// Admin only — returns full rows (including label/type) so the admin UI can render fields.
const getAllContentAdmin = async (req, res) => {
  try {
    const rows = await SiteContent.findAll({ order: [['label', 'ASC']] });
    return res.status(200).json({ content: rows });
  } catch (err) {
    console.error('Get admin site content error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PUT /api/site-content/:key ────────────────────────────────────────────────
// Admin only — creates or updates a content entry (upsert by contentKey).
// Passing label/type lets a brand-new key be registered the first time it's saved.
const upsertContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, label, type } = req.body;

    let row = await SiteContent.findOne({ where: { contentKey: key } });
    if (row) {
      row.value = value;
      if (label) row.label = label;
      if (type) row.type = type;
      await row.save();
    } else {
      row = await SiteContent.create({
        contentKey: key,
        value,
        label: label || key,
        type: type || 'text',
      });
    }

    return res.status(200).json({ content: row });
  } catch (err) {
    console.error('Upsert site content error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllContent, getAllContentAdmin, upsertContent };
