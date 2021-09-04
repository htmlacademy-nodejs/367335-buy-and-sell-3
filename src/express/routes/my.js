'use strict';

const {Router} = require(`express`);
const {modifyOffer} = require(`../lib/offers`);
const auth = require(`../middlewares/auth`);

const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers();

  offers.forEach(modifyOffer);
  res.render(`my-offers`, {offers, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const offers = await api.getOffers({comments: true});

  const restrictedOffers = offers.slice(0, 3);
  restrictedOffers.forEach(modifyOffer);
  res.render(`comments`, {offers: restrictedOffers, user});
});

module.exports = myRouter;
