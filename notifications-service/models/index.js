const sequelize = require('../config/db');

const RegistrationInquiry = require('./RegistrationInquiry');
const ContactMessage = require('./ContactMessage');
const AccountInvite = require('./AccountInvite');
const User = require('./User');

module.exports = {
  sequelize,
  RegistrationInquiry,
  ContactMessage,
  AccountInvite,
  User,
};
