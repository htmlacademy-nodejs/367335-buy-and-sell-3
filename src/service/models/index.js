'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);
const definePeople = require(`./people`);
const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);
  const People = definePeople(sequelize);

  class OfferCategory extends Model {}
  OfferCategory.init({}, {sequelize});

  Offer.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Aliase.OFFERS});
  Category.hasMany(OfferCategory, {as: Aliase.OFFER_CATEGORIES});

  People.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `peopleId`});
  Comment.belongsTo(People, {foreignKey: `peopleId`});

  People.hasMany(Offer, {as: Aliase.OFFERS, foreignKey: `peopleId`});
  Offer.belongsTo(People, {foreignKey: `peopleId`});

  return {Category, Comment, People, Offer, OfferCategory};
};

module.exports = define;
