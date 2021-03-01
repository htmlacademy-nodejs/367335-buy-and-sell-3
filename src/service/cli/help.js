'use strict';

const {outputRes} = require(`../../utils`);
const HELP_CONTENT = `
  Программа наполняет БД.

  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --filldb <count>:     наполняет базу данных
`;

module.exports = {
  name: `--help`,
  run() {
    outputRes(HELP_CONTENT, `HELP`);
  }
};
