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

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;

    const user = await service.findByEmail(email);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: `Email is incorrect`
      });
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);
    if (!passwordIsCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: `Password is incorrect`
      });
    }

    delete user.passwordHash;
    return res.status(StatusCodes.OK).json(user);
  });
};
