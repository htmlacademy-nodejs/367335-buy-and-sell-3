'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Comment`, {
  text: {
    type: setVarchar(400),
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

module.exports = define;
