const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
const Resource = sequelize.define('Resource', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  type: { type: DataTypes.ENUM('photo', 'pdf', 'link', 'other'), defaultValue: 'link' },
  url: { type: DataTypes.STRING(500), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'resources', timestamps: true });
 
module.exports = Resource;