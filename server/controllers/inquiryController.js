const crypto = require('crypto');
const { RegistrationInquiry, AccountInvite } = require('../models');
const { sendMail } = require('../utils/mailer');

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
// Admin only — update status. When set to 'accepted', sends a one-time
// account-creation invite email (guarded so re-toggling doesn't resend).
const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'accepted', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const inquiry = await RegistrationInquiry.findByPk(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found.' });
    }

    inquiry.status = status;
    await inquiry.save();

    if (status === 'accepted') {
      const existingInvite = await AccountInvite.findOne({ where: { email: inquiry.email } });

      if (!existingInvite) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await AccountInvite.create({
          firstName: inquiry.firstName,
          lastName: inquiry.lastName,
          email: inquiry.email,
          token,
          expiresAt,
        });

        const inviteLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/create-account/${token}`;

        try {
          await sendMail({
            to: inquiry.email,
            subject: 'Welcome to CITC — Create Your Account',
            html: `
              <p>Hi ${inquiry.firstName},</p>
              <p>Great news — Calgary International Track Club has accepted your inquiry! Click the link below to create your account and set a password:</p>
              <p><a href="${inviteLink}">${inviteLink}</a></p>
              <p>This link expires in 7 days.</p>
              <p>See you at the track!<br/>CITC</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
              <p style="color:#999;font-size:12px;">
                This is an automated message from an unmonitored mailbox — please do not reply directly to this email.
                For any questions, contact us at CalgaryInternationalTrackClub@gmail.com.
              </p>
            `,
          });
          console.log(`Invite email sent to ${inquiry.email}`);
        } catch (mailErr) {
          console.error('Failed to send invite email:', mailErr);
        }
      } else {
        console.log(`Invite already exists for ${inquiry.email}, skipping resend.`);
      }
    }

    return res.status(200).json({ message: 'Inquiry updated.', inquiry });
  } catch (err) {
    console.error('Update inquiry error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// ── DELETE /api/inquiries/:id ─────────────────────────────────────────────────
// Admin only.
const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await RegistrationInquiry.findByPk(id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found.' });
    await inquiry.destroy();
    return res.status(200).json({ message: 'Inquiry deleted.' });
  } catch (err) {
    console.error('Delete inquiry error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createInquiry, getInquiries, updateInquiryStatus, deleteInquiry };
