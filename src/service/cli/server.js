'use strict';

const {DEFAULT_LOCAL_PORT, FILE_NAME, NOT_FOUND_MSG, HttpCode} = require(`../../constants`);
const {outputRes} = require(`../../utils`);
const {readFile} = require(`fs`).promises;
const express = require(`express`);

const app = express();
app.use(express.json());

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await readFile(FILE_NAME);
    res.json(JSON.parse(fileContent));
  } catch (err) {
    res.json([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(NOT_FOUND_MSG));

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
