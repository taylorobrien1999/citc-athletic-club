const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClubRecord = sequelize.define('ClubRecord', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  athleteName: { type: DataTypes.STRING(150), allowNull: false },
  event: { type: DataTypes.STRING(150), allowNull: false }, // e.g. "60m Hurdles"
  category: { type: DataTypes.STRING(100), allowNull: false }, // e.g. "U17" or "Open"
  mark: { type: DataTypes.STRING(50), allowNull: false }, // e.g. "7.77"
  note: { type: DataTypes.STRING(200), allowNull: true }, // e.g. "Canadian Record"
}, { tableName: 'club_records', timestamps: true });

module.exports = ClubRecord;