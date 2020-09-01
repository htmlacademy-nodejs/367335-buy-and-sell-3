'use strict';

const {DEFAULT_PORT, FILE_NAME, NOT_FOUND_MSG, HttpCode} = require(`../../constants`);
const {outputRes} = require(`../../utils`);
const {createServer} = require(`http`);
const {readFile} = require(`fs`).promises;

const getLayout = (message) => `
<!DOCTYPE html>
  <html lang="ru">
  <head>
    <title>Buy and sell</title>
  </head>
  <body>${message}</body>
</html>`.trim();

const sendResponse = (res, statusCode, message) => {
  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`
  });

  res.end(getLayout(message));
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const fileContent = await readFile(FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MSG);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MSG);
      break;
  }
};

module.exports = {
  name: `--server`,
  run([customPort]) {
    const port = Number.parseInt(customPort) || DEFAULT_PORT;

    createServer(onClientConnect)
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return outputRes(`Ошибка при создании сервера`, `ERROR`);
        }

        return outputRes(`Ожидаю соединений на ${port}`, `SUCCESS`);
      });
  }
};
