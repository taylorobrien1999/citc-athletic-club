const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RegistrationInquiry = sequelize.define('RegistrationInquiry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  parentEmail: { type: DataTypes.STRING(255), allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'contacted', 'accepted', 'declined'), defaultValue: 'pending' },
}, { tableName: 'registration_inquiries', timestamps: true });

module.exports = RegistrationInquiry;