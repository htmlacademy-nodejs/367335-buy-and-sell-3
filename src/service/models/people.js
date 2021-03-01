'use strict';

const {DataTypes, Model} = require(`sequelize`);
const setVarchar = DataTypes.STRING;
const setChar = DataTypes.CHAR;

class People extends Model {}

const define = (sequelize) => People.init({
  name: {
    type: setVarchar(100),
    allowNull: false
  },
  email: {
    type: setVarchar(100),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: setChar(128),
    allowNull: false
  },
  avatar: {
    type: setVarchar(256),
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: `People`,
  tableName: `peoples`
});

module.exports = define;
