'use strict';

const getValidator = require(`../lib/get-validator`);
const commentKeys = [`text`];

module.exports = (req, res, next) => getValidator(commentKeys, req, res, next);
