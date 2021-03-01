'use strict';

const {Router} = require(`express`);
const {modifyOffer} = require(`../lib/offers`);
const declineWord = require(`decline-word`);

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [offers, categories] = await Promise.all([
    api.getOffers(),
    api.getCategories(true)
  ]);
  offers.forEach(modifyOffer);
  res.render(`main`, {offers, categories});
});

mainRouter.get(`/search`, async (req, res) => {
  try {
    const results = await api.search(req.query.search);
    results.forEach(modifyOffer);

    res.render(`search-result`, {
      results,
      findWord: declineWord(results.length, `Найден`, `а`, `о`, `о`),
      pubWord: declineWord(results.length, `публикаци`, `я`, `и`, `й`)
    });
  } catch (error) {
    res.render(`search-result`, {results: []});
  }
});

mainRouter.get(`/login`, (req, res) => {
  res.render(`login`);
});

mainRouter.get(`/register`, (req, res) => {
  res.render(`sign-up`);
});

module.exports = mainRouter;
