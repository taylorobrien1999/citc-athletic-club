const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const announcementRoutes = require('./routes/announcementRoutes');
const eventRoutes = require('./routes/eventRoutes');
const programRoutes = require('./routes/programRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const siteContentRoutes = require('./routes/siteContentRoutes');
const path = require('path');
const recordRoutes = require('./routes/recordRoutes');
const chatProxyRoutes = require('./routes/chatProxyRoutes');
const teamCoachRoutes = require('./routes/teamCoachRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/chat', chatProxyRoutes);
app.use('/api/team-coaches', teamCoachRoutes);
app.use('/api/sponsors', sponsorRoutes);

// ── Serve React build (production) ────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, 'client-build');
app.use(express.static(clientBuildPath));

// Catch-all: any non-API route falls back to React's index.html so client-side
// routing (React Router) works correctly on refresh/direct URL access.
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });