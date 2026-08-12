const sequelize = require('../config/db');

const User = require('./User');
const AccountInvite = require('./AccountInvite');
const PasswordResetToken = require('./PasswordResetToken');

module.exports = {
  sequelize,
  User,
  AccountInvite,
  PasswordResetToken,
};
