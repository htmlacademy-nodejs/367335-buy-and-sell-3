'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {StatusCodes} = require(`http-status-codes`);
const {sendOffer} = require(`../lib/offers`);
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);
const {getUrlJson} = require(`../../utils`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();
const csrfProtection = csrf({cookie: true});

offersRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;

  res.render(`category`, {user});
});

offersRouter.get(`/edit/:id`, [
  auth,
  csrfProtection
], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {payload = `{}`, errors = `{}`} = req.query;
  const [categories, offer] = await Promise.all([
    api.getCategories(),
    api.getOffer({id})
  ]);

  res.render(`offer-edit`, {
    offer: {...offer, ...JSON.parse(payload)},
    categories,
    errors: JSON.parse(errors),
    user,
    csrfToken: req.csrfToken()
  });
});

offersRouter.get(`/add`, [
  auth,
  csrfProtection
], async (req, res) => {
  const {user} = req.session;
  const {payload = `{}`, errors = `{}`} = req.query;
  const categories = await api.getCategories();
  const offer = JSON.parse(payload);
  if (!offer.categories) {
    offer.categories = [];
  }

  res.render(`offer-edit`, {
    offer,
    categories,
    errors: JSON.parse(errors),
    user,
    csrfToken: req.csrfToken()
  });
});

offersRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {payload = `{}`, errors = `{}`} = req.query;
  const offer = await api.getOffer({id, comments: 1});

  res.render(`offer`, {
    offer,
    payload: JSON.parse(payload),
    errors: JSON.parse(errors),
    user,
    csrfToken: req.csrfToken() // для формы комментариев
  });
});

offersRouter.post(`/add`, [
  auth,
  upload.single(`picture`),
  csrfProtection
], sendOffer);

offersRouter.put(`/edit/:id`, [
  auth,
  upload.single(`picture`),
  csrfProtection
], sendOffer);

offersRouter.post(`/:id`, async ({params, body}, res) => {
  if (body.comment) {
    res.redirect(StatusCodes.PERMANENT_REDIRECT, `/offers/${params.id}/comments`);
  }
});

offersRouter.post(`/:id/comments`, [
  auth,
  csrfProtection
], async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const commentData = {
    userId: user.id,
    text: req.body.comment.trim()
  };

  try {
    await api.createComment(id, commentData);
    res.redirect(`/offers/${id}`);
  } catch (err) {
    res.redirect(`/offers/${id}?payload=${getUrlJson(commentData)}&errors=${getUrlJson(err.response.data)}`);
  }
});

module.exports = offersRouter;
