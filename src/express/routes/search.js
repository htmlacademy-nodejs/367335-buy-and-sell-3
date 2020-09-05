'use strict';

const {Services: {SEARCH}} = require(`../../constants`);
const {Router} = require(`express`);
const searchRouter = new Router();

searchRouter.get(`/`, (req, res) => {
  res.send(`/${SEARCH.alias}`);
});

module.exports = searchRouter;
