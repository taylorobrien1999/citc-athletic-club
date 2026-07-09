const sequelize = require('../config/db');
const User = require('./User');
const Athlete = require('./Athlete');
const Coach = require('./Coach');
const Program = require('./Program');
const Event = require('./Event');
const Announcement = require('./Announcement');
const RegistrationInquiry = require('./RegistrationInquiry');
const Feedback = require('./Feedback');
const Resource = require('./Resource');
const ContactMessage = require('./ContactMessage');


// Associations
User.hasOne(Athlete, { foreignKey: 'userId', onDelete: 'CASCADE' });
Athlete.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Coach, { foreignKey: 'userId', onDelete: 'CASCADE' });
Coach.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Athlete,
  Coach,
  Program,
  Event,
  Announcement,
  RegistrationInquiry,
  Feedback,
  Resource,
  ContactMessage,
};
