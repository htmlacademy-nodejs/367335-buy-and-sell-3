'use strict';

const {gray} = require(`chalk`);
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
    console.info(gray(HELP_CONTENT));
  }
};
