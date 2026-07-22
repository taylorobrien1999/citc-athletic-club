const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Named TeamCoach (not Coach) to avoid colliding with the existing Coach.js
// model, which links a login account (User) to a coach role — unrelated to
// this public-facing bio/roster display system.
const TeamCoach = sequelize.define('TeamCoach', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  role: { type: DataTypes.STRING(150), allowNull: true }, // e.g. "Head Coach"
  photoUrl: { type: DataTypes.STRING(500), allowNull: true },
  homepageSummary: { type: DataTypes.TEXT, allowNull: true }, // short teaser blurb, homepage only
  fullBio: { type: DataTypes.TEXT, allowNull: true }, // longer bio, full Coaches page
  qualifications: { type: DataTypes.TEXT, allowNull: true }, // one per line
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'team_coaches', timestamps: true });

module.exports = TeamCoach;
