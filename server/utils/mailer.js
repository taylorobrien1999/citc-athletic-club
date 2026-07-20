const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Calgary International Track Club" <${process.env.GMAIL_USER}>`,
    replyTo: process.env.CLUB_REPLY_TO_EMAIL || 'CalgaryInternationalTrackClub@gmail.com',
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };