const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  eventDate: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING(20), allowNull: true },
  location: { type: DataTypes.STRING(200), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  visibility: { type: DataTypes.ENUM('public', 'members'), defaultValue: 'public' },
}, { tableName: 'events', timestamps: true });

module.exports = Event;
