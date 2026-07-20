const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
const Program = sequelize.define('Program', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  ageGroup: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'programs', timestamps: true });
 
module.exports = Program;