const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RegistrationInquiry = sequelize.define('RegistrationInquiry', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: true },
  parentEmail: { type: DataTypes.STRING(255), allowNull: true },
  dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
  yearsRunning: { type: DataTypes.INTEGER, allowNull: true },
  indoorGoals: { type: DataTypes.TEXT, allowNull: true },
  outdoorGoals: { type: DataTypes.TEXT, allowNull: true },
  agreedToCodeOfConduct: { type: DataTypes.BOOLEAN, defaultValue: false },
  agreedToVolunteer: { type: DataTypes.BOOLEAN, defaultValue: false },
  agreedToMeetFees: { type: DataTypes.BOOLEAN, defaultValue: false },
  agreedToAttendance: { type: DataTypes.BOOLEAN, defaultValue: false },
  parentSignature: { type: DataTypes.STRING(200), allowNull: true },
  status: { type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'declined'), defaultValue: 'pending' },
}, { tableName: 'registration_inquiries', timestamps: true });

module.exports = RegistrationInquiry;