'use strict';

const {DataTypes, Model} = require(`sequelize`);
const setVarchar = DataTypes.STRING;

class Comment extends Model {}

const define = (sequelize) => Comment.init({
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
