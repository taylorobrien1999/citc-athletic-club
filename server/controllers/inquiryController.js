const { RegistrationInquiry } = require('../models');

// ── POST /api/inquiries ───────────────────────────────────────────────────────
// Public — no auth required. Guests use this to express interest in joining.
const createInquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, parentEmail, message } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required.' });
    }

    const inquiry = await RegistrationInquiry.create({
      firstName,
      lastName,
      email,
      phone,
      parentEmail,
      message,
    });

    return res.status(201).json({
      message: 'Thanks for your interest! A coach will reach out soon.',
      inquiry,
    });
  } catch (err) {
    console.error('Create inquiry error:', err);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── GET /api/inquiries ────────────────────────────────────────────────────────
// Admin only — list all inquiries, newest first.
const getInquiries = async (req, res) => {
  try {
    const inquiries = await RegistrationInquiry.findAll({
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ inquiries });
  } catch (err) {
    console.error('Get inquiries error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── PATCH /api/inquiries/:id ──────────────────────────────────────────────────
// Admin only — update status as a coach follows up (pending → contacted → accepted/declined).
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'contacted', 'accepted', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const inquiry = await RegistrationInquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    inquiry.status = status;
    await inquiry.save();

    return res.status(200).json({ message: 'Inquiry updated.', inquiry });
  } catch (err) {
    console.error('Update inquiry error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiryStatus };
