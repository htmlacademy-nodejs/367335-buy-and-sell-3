'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);
const {DEFAULT_LOCAL_PORT, ExitCode} = require(`../../constants`);
const express = require(`express`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

const logger = getLogger({name: `api`});
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => logger.info(`Response status code ${res.statusCode}`));
  next();
});

app.use(`/api`, routes);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_LOCAL_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Ошибка при создании сервера: ${err.message}`);
        }
        return logger.info(`Ожидаю соединений на ${port}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
