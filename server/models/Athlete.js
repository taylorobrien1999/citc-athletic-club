const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Athlete = sequelize.define('Athlete', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  yearsRunning: { type: DataTypes.INTEGER, allowNull: true },
  indoorGoals: { type: DataTypes.TEXT, allowNull: true },
  outdoorGoals: { type: DataTypes.TEXT, allowNull: true },
  parentEmail: { type: DataTypes.STRING(255), allowNull: true },
  parentPhone: { type: DataTypes.STRING(30), allowNull: true },
}, { tableName: 'athletes', timestamps: true });

module.exports = Athlete;