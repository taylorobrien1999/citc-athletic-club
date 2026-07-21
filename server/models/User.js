const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  // Roles:
  //   'member' — registered athlete or parent (public sign-up)
  //   'admin'  — Cindy, Tessa, Dani, Nicole (manually assigned in DB or seeded)
  // Visitors are unauthenticated — no DB row, no role needed.
  role: {
    type: DataTypes.ENUM('member', 'admin'),
    allowNull: false,
    defaultValue: 'member',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isSuperAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  emergencyContactName: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  emergencyContactRelation: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  profilePictureUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
