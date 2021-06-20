'use strict';

const {DataTypes} = require(`sequelize`);
const {MaxValue} = require(`../../constants`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Category`, {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: setVarchar(MaxValue.CATEGORY),
    allowNull: false
  },
  picture: {
    type: setVarchar(MaxValue.FILENAME),
    unique: true
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});

module.exports = define;
