'use strict';

const Joi = require(`joi`);
const validateSchema = require(`../lib/validate-schema`);
const {MinValue, MaxValue} = require(`../../constants`);

const schema = Joi.object({
  text: Joi.string()
    .min(MinValue.COMMENT)
    .max(MaxValue.COMMENT)
    .required(),
  userId: Joi.number()
    .integer()
    .positive()
    .required()
});

module.exports = (req, res, next) => validateSchema({schema, object: req.body, res, next});
