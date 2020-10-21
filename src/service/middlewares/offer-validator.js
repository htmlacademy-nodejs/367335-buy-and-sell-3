'use strict';

const getValidator = require(`../lib/get-validator`);
const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = (req, res, next) => getValidator(offerKeys, req, res, next);

