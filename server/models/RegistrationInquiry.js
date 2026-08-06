const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RegistrationInquiry = sequelize.define('RegistrationInquiry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        msg: 'First name can only contain letters, spaces, hyphens, and apostrophes.',
      },
    },
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        msg: 'Last name can only contain letters, spaces, hyphens, and apostrophes.',
      },
    },
  },
  email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      isValidPhone(value) {
        if (!value) return;
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
          throw new Error('Phone number must contain exactly 10 digits.');
        }
      },
    },
  },
  parentEmail: { type: DataTypes.STRING(255), allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'contacted', 'accepted', 'declined'), defaultValue: 'pending' },
}, { tableName: 'registration_inquiries', timestamps: true });

module.exports = RegistrationInquiry;