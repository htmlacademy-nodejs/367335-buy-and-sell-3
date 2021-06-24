'use strict';

const {outputRes} = require(`../../utils`);
const HELP_CONTENT = `
  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --server:             запускает сервер API
  --filldb <count>:     наполняет базу данных
`;

module.exports = {
  name: `--help`,
  run() {
    outputRes(HELP_CONTENT, `HELP`);
  }
};
