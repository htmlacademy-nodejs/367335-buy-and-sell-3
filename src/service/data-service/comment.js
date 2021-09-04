'use strict';

const UserRelatedService = require(`./user-related`);

class CommentService extends UserRelatedService {
  constructor({models}) {
    super({models});

    this._Offer = models.Offer;
    this._Comment = models.Comment;
  }

  create(offerId, comment) {
    return this._Comment.create({
      offerId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(offerId) {
    return this._Comment.findAll({
      where: {offerId},
      // order: [[`createdAt`, `desc`]],
      include: [this._userInclusion],
      raw: true
    });
  }
}

module.exports = CommentService;
