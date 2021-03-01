'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(StatusCodes.BAD_REQUEST).json([]);
    }

    const searchResults = await service.findAll(query);
    const searchStatus = StatusCodes[searchResults.length ? `OK` : `NOT_FOUND`];

    return res.status(searchStatus).json(searchResults);
  });
};
