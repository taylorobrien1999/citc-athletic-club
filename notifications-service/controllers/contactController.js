const { ContactMessage } = require('../models');
const { sendMail } = require('../utils/mailer');

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Public — no auth required.
const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });

    // Notify the club's real inbox — previously this only saved to the
    // database with no way for anyone to actually see a new submission.
    try {
      await sendMail({
        to: 'rudecindy13@gmail.com',
        subject: `New Contact Form Message${subject ? `: ${subject}` : ''}`,
        html: `
          <p><strong>From:</strong> ${name} (${email})</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    } catch (mailErr) {
      // Don't fail the whole request if email sending has an issue — the
      // message is still safely saved in the database either way.
      console.error('Contact form email notification failed:', mailErr);
    }

    return res.status(201).json({
      message: "Thanks for reaching out! We'll get back to you as soon as possible.",
      contactMessage,
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.errors[0].message });
    }
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