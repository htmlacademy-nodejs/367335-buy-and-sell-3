'use strict';

const Joi = require(`joi`);
const validateSchema = require(`../lib/validate-schema`);

const schema = Joi.object({
  offerId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1).optional()
});

module.exports = (req, res, next) => validateSchema({schema, object: req.params, res, next});
