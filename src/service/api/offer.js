'use strict';

const {Router} = require(`express`);
const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);
const offerExist = require(`../middlewares/offer-exists`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, offerService, commentService) => {
  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    return res.status(StatusCodes.OK).json(offers);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);
    return res.status(StatusCodes.CREATED).json(offer);
  });

  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      const reason = `${ReasonPhrases.NOT_FOUND} with ${offerId}`;
      return res.status(StatusCodes.NOT_FOUND).send(reason);
    }

    return res.status(StatusCodes.OK).json(offer);
  });

  route.put(`/:offerId`, offerValidator, (req, res) => {
    const {offerId} = req.params;
    const existOffer = offerService.findOne(offerId);

    if (!existOffer) {
      const reason = `${ReasonPhrases.NOT_FOUND} with ${offerId}`;
      return res.status(StatusCodes.NOT_FOUND).send(reason);
    }

    const updatedOffer = offerService.update(offerId, req.body);
    return res.status(StatusCodes.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.drop(offerId);

    if (!offer) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json(offer);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    return res.status(StatusCodes.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(StatusCodes.CREATED).json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json(deletedComment);
  });
};
