'use strict';

const {Router} = require(`express`);
const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);
const offerExist = require(`../middlewares/offer-exists`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();
  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {offset = 0, limit = 0, comments} = req.query;
    let offers;
    if (limit || offset) {
      offers = await offerService.findPage({limit, offset});
    } else {
      offers = await offerService.findAll(comments);
    }
    return res.status(StatusCodes.OK).json(offers);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);
    return res.status(StatusCodes.CREATED).json(offer);
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      const reason = `${ReasonPhrases.NOT_FOUND} with ${offerId}`;
      return res.status(StatusCodes.NOT_FOUND).send(reason);
    }

    return res.status(StatusCodes.OK).json(offer);
  });

  route.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;
    const existOffer = await offerService.findOne(offerId);

    if (!existOffer) {
      const reason = `${ReasonPhrases.NOT_FOUND} with ${offerId}`;
      return res.status(StatusCodes.NOT_FOUND).send(reason);
    }

    const updatedOffer = await offerService.update(offerId, req.body);
    return res.status(StatusCodes.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.drop(offerId);

    if (!offer) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offerId} = req.params;
    const comments = await commentService.findAll(offerId);

    return res.status(StatusCodes.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [
    offerExist(offerService),
    commentValidator
  ], async (req, res) => {
    const {offerId} = req.params;
    const comment = await commentService.create(offerId, req.body);

    return res.status(StatusCodes.CREATED).json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json(deleted);
  });
};
