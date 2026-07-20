const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AccountInvite = sequelize.define('AccountInvite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  used: { type: DataTypes.BOOLEAN, defaultValue: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
}, { tableName: 'account_invites', timestamps: true });

module.exports = AccountInvite;
