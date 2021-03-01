'use strict';

const {StatusCodes} = require(`http-status-codes`);

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;
  const offer = await service.findOne(offerId);

  if (!offer) {
    const reason = `Offer with ${offerId} not found`;
    return res.status(StatusCodes.NOT_FOUND).send(reason);
  }

  return next();
};
