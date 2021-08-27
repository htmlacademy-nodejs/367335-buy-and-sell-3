'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async ({body}, res) => {
    body.passwordHash = await passwordUtils.hash(body.password);

    const result = await service.create(body);
    delete result.passwordHash;

    return res.status(StatusCodes.CREATED).json(result);
  });
};
