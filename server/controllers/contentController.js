const { Program, Resource, Feedback } = require('../models');

// ── PROGRAMS ───────────────────────────────────────────────────────────────────

const getPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ programs });
  } catch (err) {
    console.error('Get programs error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const createProgram = async (req, res) => {
  try {
    const { name, ageGroup, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }
    const program = await Program.create({ name, ageGroup, description });
    return res.status(201).json({ program });
  } catch (err) {
    console.error('Create program error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);
    if (!program) return res.status(404).json({ message: 'Program not found.' });

    const { name, ageGroup, description } = req.body;
    if (name !== undefined) program.name = name;
    if (ageGroup !== undefined) program.ageGroup = ageGroup;
    if (description !== undefined) program.description = description;
    await program.save();

    return res.status(200).json({ program });
  } catch (err) {
    console.error('Update program error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    await program.destroy();
    return res.status(200).json({ message: 'Program deleted.' });
  } catch (err) {
    console.error('Delete program error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── RESOURCES ──────────────────────────────────────────────────────────────────

const getResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ resources });
  } catch (err) {
    console.error('Get resources error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const createResource = async (req, res) => {
  try {
    const { title, type, url, description } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required.' });
    }
    const resource = await Resource.create({ title, type, url, description });
    return res.status(201).json({ resource });
  } catch (err) {
    console.error('Create resource error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });
    await resource.destroy();
    return res.status(200).json({ message: 'Resource deleted.' });
  } catch (err) {
    console.error('Delete resource error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── FEEDBACK ───────────────────────────────────────────────────────────────────

const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error('Get feedback error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['new', 'reviewed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const feedback = await Feedback.findByPk(id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found.' });
    feedback.status = status;
    await feedback.save();
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error('Update feedback error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getPrograms, createProgram, updateProgram, deleteProgram,
  getResources, createResource, deleteResource,
  getFeedback, updateFeedbackStatus,
};