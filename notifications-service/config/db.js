const { Sequelize } = require('sequelize');
require('dotenv').config();

// This service connects to the SAME physical Postgres database as the other
// three services. Each service defines its own model files (below), but they
// map to shared tables. This is the "shared database" microservices pattern —
// simpler to operate than fully isolated per-service databases, and a
// reasonable, deliberate tradeoff for a project at this scale. The genuine
// service boundary is enforced at the deployment/process level (separate
// Azure App Services, separate scaling, separate deploys), not the DB level.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false,
      } : false,
    },
  }
);

module.exports = sequelize;
