'use strict';

const {DataTypes, Model} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

class Category extends Model {}

const define = (sequelize) => Category.init({
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
