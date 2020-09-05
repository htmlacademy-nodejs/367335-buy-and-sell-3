'use strict';

const {Services: {OFFERS}} = require(`../../constants`);
const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => {
  res.send(`/${OFFERS.alias}/add`);
});

offersRouter.get(`/:id`, (req, res) => {
  res.send(`/${OFFERS.alias}/:id`);
});

offersRouter.get(`/category/:id`, (req, res) => {
  res.send(`/${OFFERS.alias}/category/:id`);
});

offersRouter.get(`/edit/:id`, (req, res) => {
  res.send(`/${OFFERS.alias}/edit/:id`);
});

module.exports = offersRouter;
