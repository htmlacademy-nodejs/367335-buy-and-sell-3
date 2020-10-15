'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

module.exports = (compareKeys, req, res, next) => {
  const keys = Object.keys(req.body);
  const keysExists = compareKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
  }

  return next();
};
