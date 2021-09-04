'use strict';

const {Router} = require(`express`);
const declineWord = require(`decline-word`);
const {modifyOffer} = require(`../lib/offers`);
const {getUrlJson} = require(`../../utils`);
const upload = require(`../middlewares/upload`);

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = Number(page);

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;
  const {user} = req.session;

  const [{count, offers}, categories] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true)
  ]);
  offers.forEach(modifyOffer);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main`, {offers, categories, page, totalPages, user});
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;

  try {
    const results = await api.search(req.query.search);
    results.forEach(modifyOffer);

    res.render(`search-result`, {
      results,
      findWord: declineWord(results.length, `Найден`, `а`, `о`, `о`),
      pubWord: declineWord(results.length, `публикаци`, `я`, `и`, `й`),
      user
    });
  } catch (error) {
    res.render(`search-result`, {results: [], user});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`login`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors),
    user
  });
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);
    req.session.user = user;
    req.session.save(() => res.redirect(`/`));
  } catch (err) {
    res.redirect(`/login?payload=${getUrlJson({email})}&errors=${getUrlJson(err.response.data)}`);
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => res.redirect(`/`));
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;

  res.render(`sign-up`, {
    payload: JSON.parse(payload),
    errors: JSON.parse(errors),
    user
  });
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    ...body,
    avatar: file ? file.filename : body.picture_uploaded // если пользователь не загрузил новую картинку, оставляем прежнюю
  };
  delete userData.picture_uploaded;

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    res.redirect(`/register?payload=${getUrlJson(userData)}&errors=${getUrlJson(err.response.data)}`);
  }
});

module.exports = mainRouter;
