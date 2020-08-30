'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    ERROR: 1,
    SUCCESS: 0
  },
  LogMode: {
    DEFAULT: {
      color: `white`,
      method: `log`
    },
    ERROR: {
      color: `red`,
      method: `error`,
      exitCode: `ERROR`
    },
    HELP: {
      color: `gray`,
      method: `info`
    },
    INFO: {
      color: `blue`,
      method: `info`
    },
    SUCCESS: {
      color: `green`,
      method: `info`,
      exitCode: `SUCCESS`
    }
  }
};
