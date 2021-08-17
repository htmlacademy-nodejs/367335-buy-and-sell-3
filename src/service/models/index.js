'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const defineUser = require(`./user`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const User = defineUser(sequelize);
  const OfferCategory = sequelize.define(`OfferCategory`, {}, {sequelize});

  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Offer, {as: Aliase.OFFERS, foreignKey: `userId`});
  Offer.belongsTo(User, {foreignKey: `userId`});

  return {Category, Comment, User, Offer, OfferCategory};
};

module.exports = define;
