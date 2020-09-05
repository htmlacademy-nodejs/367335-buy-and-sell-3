'use strict';

const {Services: {MY}} = require(`../../constants`);
const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => {
  res.send(`/${MY.alias}`);
});

myRouter.get(`/comments`, (req, res) => {
  res.send(`/${MY.alias}/comments`);
});

module.exports = myRouter;
