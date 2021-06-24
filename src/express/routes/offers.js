'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const {sendOffer} = require(`../lib/offers`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const {payload = `{}`, errors = `{}`} = req.query;
  const [categories, offer] = await Promise.all([
    api.getCategories(),
    api.getOffer(id)
  ]);
  res.render(`offer-edit`, {
    offer: {...offer, ...JSON.parse(payload)},
    categories,
    errors: JSON.parse(errors)
  });
});

offersRouter.get(`/add`, async (req, res) => {
  const {payload = `{}`, errors = `{}`} = req.query;
  const categories = await api.getCategories();
  const offer = JSON.parse(payload);
  if (!offer.categories) {
    offer.categories = [];
  }
  res.render(`offer-edit`, {
    offer,
    categories,
    errors: JSON.parse(errors)
  });
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const {payload = `{}`, errors = `{}`} = req.query;
  const offer = await api.getOffer({id, comments: 1});
  res.render(`offer`, {
    offer,
    payload: JSON.parse(payload),
    errors: JSON.parse(errors)
  });
});

offersRouter.post(`/add`, upload.single(`picture`), sendOffer);

offersRouter.put(`/edit/:id`, upload.single(`picture`), sendOffer);

offersRouter.post(`/:id`, async ({params, body}, res) => {
  if (body.comment) {
    res.redirect(StatusCodes.PERMANENT_REDIRECT, `/offers/${params.id}/comments`);
  }
});

offersRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const commentData = {
    text: req.body.comment.trim()
  };

  try {
    await api.createComment(id, commentData);
    res.redirect(`/offers/${id}`);
  } catch (err) {
    // передаем ранее заполненные данные для пробрасывания в форму
    const payloadStr = encodeURIComponent(JSON.stringify(commentData));

    const errorStr = encodeURIComponent(JSON.stringify(err.response.data));

    res.redirect(`/offers/${id}?payload=${payloadStr}&errors=${errorStr}`);
  }
});

module.exports = offersRouter;
