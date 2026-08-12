const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CITC Media & Upload microservice running.' });
});

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/upload', uploadRoutes);

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5300;

sequelize.authenticate()
  .then(() => {
    console.log('Media service: database connected.');
    // No sync() here — this service doesn't own any tables, it only reads
    // User for the auth middleware's live role check.
    app.listen(PORT, () => console.log(`Media service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
