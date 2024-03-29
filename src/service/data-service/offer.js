'use strict';

const Aliase = require(`../models/aliase`);
const UserRelatedService = require(`./user-related`);

class OfferService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this._Offer = models.Offer;
    this._Comment = models.Comment;
    this._Category = models.Category;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments = false) {
    const include = [Aliase.CATEGORIES, this._userInclusion];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [this._userInclusion]
      });
    }
    const offers = await this._Offer.findAll({include});
    return offers.map((item) => item.get());
  }

  async findPage({limit = 0, offset = 0}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES],
      distinct: true
    });
    return {count, offers: rows};
  }

  async findOne({offerId, comments}) {
    const include = [Aliase.CATEGORIES];
    if (Number(comments)) {
      include.push(Aliase.COMMENTS);
    }

    const offer = await this._Offer.findByPk(offerId, {include});
    if (offer) {
      return offer.get({plain: true});
    }
    return offer;
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
