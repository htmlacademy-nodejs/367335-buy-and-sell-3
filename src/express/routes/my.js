'use strict';

const {Router} = require(`express`);
const {modifyOffer} = require(`../lib/offers`);

const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  offers.forEach(modifyOffer);
  res.render(`my-tickets`, {offers});
});

myRouter.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  const restrictedOffers = offers.slice(0, 3);
  restrictedOffers.forEach(modifyOffer);
  res.render(`comments`, {offers: restrictedOffers});
});

module.exports = myRouter;
