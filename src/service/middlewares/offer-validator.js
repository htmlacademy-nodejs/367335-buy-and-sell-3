'use strict';

const Joi = require(`joi`);
const validateSchema = require(`../lib/validate-schema`);
const {MinValue, MaxValue, OfferType: {OFFER, SALE}} = require(`../../constants`);

const schema = Joi.object({
  picture: Joi.string()
    .max(MaxValue.FILENAME)
    .allow(``)
    .required(),
  title: Joi.string()
    .min(MinValue.OFFER_TITLE)
    .max(MaxValue.OFFER_TITLE)
    .required(),
  description: Joi.string()
    .min(MinValue.OFFER_TEXT)
    .max(MaxValue.OFFER_TEXT)
    .required(),
  categories: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  type: Joi.any()
    .valid(OFFER, SALE)
    .required(),
  sum: Joi.number()
    .integer()
    .min(MinValue.SUM)
    .required(),
  peopleId: Joi.number()
    .integer()
    .min(1)
    .required()
});

module.exports = (req, res, next) => validateSchema({schema, object: req.body, res, next});
