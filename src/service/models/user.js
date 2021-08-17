'use strict';

const {DataTypes} = require(`sequelize`);
const {MaxValue} = require(`../../constants`);
const setVarchar = DataTypes.STRING;
const setChar = DataTypes.CHAR;

const define = (sequelize) => sequelize.define(`User`, {
  name: {
    type: setVarchar(MaxValue.USERNAME),
    allowNull: false
  },
  email: {
    type: setVarchar(MaxValue.EMAIL),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: setChar(MaxValue.PASSWORD),
    allowNull: false
  },
  avatar: {
    type: setVarchar(MaxValue.FILENAME),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

module.exports = define;
