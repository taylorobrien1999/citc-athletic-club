const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coach = sequelize.define('Coach', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
  photoUrl: { type: DataTypes.STRING(500), allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isLegacy: { type: DataTypes.BOOLEAN, defaultValue: false }, // for JC blurb
}, { tableName: 'coaches', timestamps: true });

module.exports = Coach;