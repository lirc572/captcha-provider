const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db');

Captcha = sequelize.define('Captcha', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Captcha.sync({ force: true }); // drop table if already exists

module.exports = Captcha;
