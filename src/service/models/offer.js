'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;
const {DEFAULT_SUM, OfferType} = require(`../../constants`);

const define = (sequelize) => sequelize.define(`Offer`, {
  title: {
    type: setVarchar(100),
    allowNull: false
  },
  description: {
    type: setVarchar(1000),
    allowNull: false
  },
  picture: {
    type: setVarchar(256)
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: DEFAULT_SUM
  },
  type: {
    type: DataTypes.ENUM(...Object.values(OfferType)), // eslint-disable-line
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`
});

module.exports = define;
