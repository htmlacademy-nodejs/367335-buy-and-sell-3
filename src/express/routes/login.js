'use strict';

const {Services: {LOGIN}} = require(`../../constants`);
const {Router} = require(`express`);
const loginRouter = new Router();

loginRouter.get(`/`, (req, res) => {
  res.send(`/${LOGIN.alias}`);
});

module.exports = loginRouter;
