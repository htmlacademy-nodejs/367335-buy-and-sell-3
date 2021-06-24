'use strict';

const {DataTypes} = require(`sequelize`);
const {MaxValue} = require(`../../constants`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Comment`, {
  text: {
    type: setVarchar(MaxValue.COMMENT),
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

module.exports = define;
