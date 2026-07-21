const { ClubRecord } = require('../models');

// ── GET /api/records ────────────────────────────────────────────────────────────
const getRecords = async (req, res) => {
  try {
    const records = await ClubRecord.findAll({
      order: [['athleteName', 'ASC'], ['event', 'ASC']],
    });
    return res.status(200).json({ records });
  } catch (err) {
    console.error('Get records error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── POST /api/records ───────────────────────────────────────────────────────────
// Admin only.
const createRecord = async (req, res) => {
  try {
    const { athleteName, event, category, mark, note } = req.body;
    if (!athleteName || !event || !category || !mark) {
      return res.status(400).json({ message: 'Athlete, event, category, and mark are required.' });
    }
    const record = await ClubRecord.create({ athleteName, event, category, mark, note });
    return res.status(201).json({ record });
  } catch (err) {
    console.error('Create record error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/records/:id ──────────────────────────────────────────────────────
// Admin only.
const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ClubRecord.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Record not found.' });

    const { athleteName, event, category, mark, note } = req.body;
    if (athleteName !== undefined) record.athleteName = athleteName;
    if (event !== undefined) record.event = event;
    if (category !== undefined) record.category = category;
    if (mark !== undefined) record.mark = mark;
    if (note !== undefined) record.note = note;
    await record.save();

    return res.status(200).json({ record });
  } catch (err) {
    console.error('Update record error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/records/:id ──────────────────────────────────────────────────────
// Admin only.
const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await ClubRecord.findByPk(id);
    if (!record) return res.status(404).json({ message: 'Record not found.' });
    await record.destroy();
    return res.status(200).json({ message: 'Record deleted.' });
  } catch (err) {
    console.error('Delete record error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord };
