'use strict';

const {version} = require(`../../../package`);
const {blue} = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    console.info(blue(version));
  }
};
