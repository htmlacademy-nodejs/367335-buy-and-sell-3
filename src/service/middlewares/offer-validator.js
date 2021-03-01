'use strict';

const getValidator = require(`../lib/get-validator`);
const offerKeys = [`categories`, `description`, `picture`, `title`, `type`, `sum`, `peopleId`];

module.exports = (req, res, next) => getValidator(offerKeys, req, res, next);
