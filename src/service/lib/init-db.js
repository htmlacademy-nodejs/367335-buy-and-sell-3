"use strict";

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, offers, users}) => {
  const {Category, Offer, User} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories);

  const categoryIdByTitle = categoryModels.reduce((acc, next) => ({
    [next.title]: next.id,
    ...acc
  }), {});

  await User.bulkCreate(users);

  await Promise.all(offers.map(async (offer) => {
    const offerModel = await Offer.create(offer, {include: [Aliase.COMMENTS]});
    await offerModel.addCategories(offer.categories.map((title) => categoryIdByTitle[title]));
  }));
};
