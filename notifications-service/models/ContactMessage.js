const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactMessage = sequelize.define('ContactMessage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
        msg: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        msg: 'Please enter a valid email address.',
      },
    },
  },
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
  subject: { type: DataTypes.STRING(200), allowNull: true },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { len: { args: [1, 600], msg: 'Message must be between 1 and 600 characters.' } },
  },
  status: { type: DataTypes.ENUM('unread', 'read', 'replied'), defaultValue: 'unread' },
}, { tableName: 'contact_messages', timestamps: true });

module.exports = ContactMessage;