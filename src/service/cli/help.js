'use strict';

const {outputRes} = require(`../../utils`);
const HELP_CONTENT = `
  Программа формирует файл с данными для API.

  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
`;

module.exports = {
  name: `--help`,
  run() {
    outputRes(HELP_CONTENT, `HELP`);
  }
};
