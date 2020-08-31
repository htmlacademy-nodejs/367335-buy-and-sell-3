'use strict';

const {version} = require(`../../../package`);
const {outputRes} = require(`../../utils`);

module.exports = {
  name: `--version`,
  run() {
    outputRes(version, `INFO`);
  }
};
