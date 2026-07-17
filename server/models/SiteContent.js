const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SiteContent = sequelize.define('SiteContent', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  contentKey: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  type: { type: DataTypes.ENUM('text', 'image'), defaultValue: 'text' },
  label: { type: DataTypes.STRING(200), allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'site_content', timestamps: true });

module.exports = SiteContent;
