'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

const define = (sequelize) => sequelize.define(`Category`, {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: setVarchar(50),
    allowNull: false
  },
  picture: {
    type: setVarchar(256),
    unique: true
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});

module.exports = define;
