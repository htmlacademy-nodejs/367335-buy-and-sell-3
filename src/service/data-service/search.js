'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);
const UserRelatedService = require(`./user-related`);

class SearchService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this._Offer = models.Offer;
  }

  async findAll(searchText) {
    const offers = await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES, this._userInclusion]
    });
    return offers.map((offer) => offer.get());
  }
}

module.exports = SearchService;
