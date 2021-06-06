'use strict';

const {Router} = require(`express`);
const {modifyOffer} = require(`../lib/offers`);
const declineWord = require(`decline-word`);

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = Number(page);

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);
  offers.forEach(modifyOffer);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {offers, categories, page, totalPages});
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
