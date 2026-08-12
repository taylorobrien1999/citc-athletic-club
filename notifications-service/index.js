const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const contactRoutes = require('./routes/contactRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CITC Notifications microservice running.' });
});

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);
app.use('/api/inquiries', inquiryRoutes);

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5100;

sequelize.authenticate()
  .then(() => {
    console.log('Notifications service: database connected.');
    // NOTE: intentionally no sync({ alter: true }) here — schema ownership
    // for these tables belongs to whichever service is the "source of
    // truth." Running sync from multiple services against shared tables
    // risks conflicting migrations. Only the Auth/Identity service (which
    // owns User) and one designated service per table should sync.
    app.listen(PORT, () => console.log(`Notifications service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
