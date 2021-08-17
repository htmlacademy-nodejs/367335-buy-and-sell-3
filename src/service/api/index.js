'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const offer = require(`../api/offer`);
const search = require(`../api/search`);
const sequelize = require(`../lib/sequelize`);
const user = require(`../api/user`);
const defineModels = require(`../models`);
const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
  UserService
} = require(`../data-service`);

const app = new Router();

defineModels(sequelize);

category(app, new CategoryService(sequelize));
search(app, new SearchService(sequelize));
offer(app, new OfferService(sequelize), new CommentService(sequelize));
user(app, new UserService(sequelize));

module.exports = app;
