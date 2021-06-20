'use strict';

const {DataTypes} = require(`sequelize`);
const setVarchar = DataTypes.STRING;
const setEnum = DataTypes.ENUM;
const {MinValue, MaxValue, OfferType} = require(`../../constants`);

const define = (sequelize) => sequelize.define(`Offer`, {
  title: {
    type: setVarchar(MaxValue.OFFER_TITLE),
    allowNull: false
  },
  description: {
    type: setVarchar(MaxValue.OFFER_TEXT),
    allowNull: false
  },
  picture: {
    type: setVarchar(MaxValue.FILENAME)
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: MinValue.SUM
  },
  type: {
    type: setEnum(...Object.values(OfferType)),
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`
});

module.exports = define;
