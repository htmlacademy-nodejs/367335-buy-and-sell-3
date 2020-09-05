'use strict';

const {Services: {REGISTER}} = require(`../../constants`);
const {Router} = require(`express`);
const registerRouter = new Router();

registerRouter.get(`/`, (req, res) => {
  res.send(`/${REGISTER.alias}`);
});

module.exports = registerRouter;
