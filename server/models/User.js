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
    validate: {
      // Optional field — only validate format if a value is actually provided.
      isValidPhone(value) {
        if (!value) return;
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
          throw new Error('Phone number must contain exactly 10 digits.');
        }
      },
    },
  },
  emergencyContactName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isValidName(value) {
        if (!value) return;
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(value)) {
          throw new Error('Emergency contact name can only contain letters, spaces, hyphens, and apostrophes.');
        }
      },
    },
  },
  emergencyContactRelation: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  emergencyContactPhone: {
    type: DataTypes.STRING(30),
    allowNull: true,
    validate: {
      isValidPhone(value) {
        if (!value) return;
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
          throw new Error('Emergency contact phone must contain exactly 10 digits.');
        }
      },
    },
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
