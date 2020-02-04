'use strict';

const {version} = require(`../../../package`);

module.exports = {
  name: `--version`,
  run() {
    console.info(version);
  }
};
