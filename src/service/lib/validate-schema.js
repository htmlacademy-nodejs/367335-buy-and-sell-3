'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = async ({schema, object, res, next}) => {
  try {
    await schema.validateAsync(object, {abortEarly: false});
    return next();
  } catch ({details}) {
    const errors = {};
    for (const {context, message} of details) {
      errors[context.key] = message;
    }
    return res.status(StatusCodes.BAD_REQUEST).send(errors);
  }
};
