'use strict';

const Joi = require(`joi`);
const {StatusCodes} = require(`http-status-codes`);
const {MinValue, MaxValue, USERNAME_PATTERN} = require(`../../constants`);

const schema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp(USERNAME_PATTERN))
    .max(MaxValue.USERNAME)
    .required(),
  email: Joi.string()
    .email()
    .max(MaxValue.EMAIL)
    .required(),
  password: Joi.string()
    .min(MinValue.PASSWORD)
    .max(MaxValue.PASSWORD)
    .required(),
  passwordRepeated: Joi.string()
    .required()
    .valid(Joi.ref(`password`)),
  avatar: Joi.string()
    .min(MinValue.PASSWORD)
    .max(MaxValue.PASSWORD)
    .required()
});

module.exports = (service) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {abortEarly: false});
  } catch ({details}) {
    const errors = {};
    for (const {context, message} of details) {
      errors[context.key] = message;
    }
    return res.status(StatusCodes.BAD_REQUEST).send(errors);
  }

  const userByEmail = await service.findByEmail(req.body.email);
  if (userByEmail) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      email: `Email is already in use`
    });
  }

  return next();
};
