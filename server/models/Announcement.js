const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  body: { type: DataTypes.TEXT, allowNull: false },
  postedBy: { type: DataTypes.STRING(150), allowNull: true },
  imageUrl: { type: DataTypes.STRING(500), allowNull: true },
}, { tableName: 'announcements', timestamps: true });

module.exports = Announcement;
