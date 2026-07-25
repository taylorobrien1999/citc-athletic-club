const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  subject: { type: DataTypes.STRING(200), allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('unread', 'read', 'replied'), defaultValue: 'unread' },
}, { tableName: 'contact_messages', timestamps: true });

module.exports = ContactMessage;