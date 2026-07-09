const { ContactMessage } = require('../models');

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Public — no auth required.
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const contactMessage = await ContactMessage.create({ name, email, subject, message });

    return res.status(201).json({
      message: "Thanks for reaching out! We'll get back to you as soon as possible.",
      contactMessage,
    });
  } catch (err) {
    console.error('Create contact message error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── GET /api/contact ──────────────────────────────────────────────────────────
// Admin only — list all messages, newest first.
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ messages });
  } catch (err) {
    console.error('Get contact messages error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/contact/:id ────────────────────────────────────────────────────
// Admin only — mark as read/replied.
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['unread', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const contactMessage = await ContactMessage.findByPk(id);
    if (!contactMessage) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    contactMessage.status = status;
    await contactMessage.save();

    return res.status(200).json({ message: 'Message updated.', contactMessage });
  } catch (err) {
    console.error('Update contact message error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createMessage, getMessages, updateMessageStatus };
