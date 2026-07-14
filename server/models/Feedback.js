const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  submittedBy: { type: DataTypes.STRING(150), allowNull: true },
  subject: { type: DataTypes.STRING(200), allowNull: true },
  rating: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('new', 'reviewed'), defaultValue: 'new' },
}, { tableName: 'feedback', timestamps: true });
 
module.exports = Feedback;
 