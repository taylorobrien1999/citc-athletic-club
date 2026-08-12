const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const accountInviteRoutes = require('./routes/accountInviteRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CITC Auth & Identity microservice running.' });
});

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/account-invites', accountInviteRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/members', memberRoutes);

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5200;

sequelize.authenticate()
  .then(() => {
    console.log('Auth service: database connected.');
    // NOTE: this service owns User, so it's the one that should run
    // sync({ alter: true }) if schema changes are needed for these tables.
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
