'use strict';

const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);
const {DEFAULT_LOCAL_PORT} = require(`../../constants`);
const {outputRes} = require(`../../utils`);
const express = require(`express`);
const routes = require(`../api`);

const app = express();
app.use(express.json());

app.use(`/api`, routes);

app.use((req, res) => res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND));

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort, 10) || DEFAULT_LOCAL_PORT;

    app.listen(port, (err) => {
      if (err) {
        return outputRes(`Ошибка при создании сервера`, `ERROR`);
      }
      return outputRes(`Ожидаю соединений на ${port}`, `SUCCESS`);
    });
  }
};
