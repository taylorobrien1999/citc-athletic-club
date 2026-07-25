const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sponsor = sequelize.define('Sponsor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  logoUrl: { type: DataTypes.STRING(500), allowNull: false },
  websiteUrl: { type: DataTypes.STRING(500), allowNull: true },
  displayOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'sponsors', timestamps: true });

module.exports = Sponsor;
