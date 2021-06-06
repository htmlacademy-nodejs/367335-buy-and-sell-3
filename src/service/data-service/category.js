'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor({models}) {
    this._Category = models.Category;
    this._OfferCategory = models.OfferCategory;
  }

  async findAll(needCount) {
    if (!needCount) {
      return this._Category.findAll({raw: true});
    }

    const result = await this._Category.findAll({
      attributes: [`id`, `title`, [Sequelize.fn(`COUNT`, `*`), `count`]],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._OfferCategory,
        as: Aliase.OFFER_CATEGORIES,
        attributes: []
      }]
    });
    return result.map((it) => it.get());
  }
}

module.exports = CategoryService;
