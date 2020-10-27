'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  DEFAULT_PORT: 8080,
  DEFAULT_LOCAL_PORT: 3000,
  FILE_NAME: `mocks.json`,
  GENERATED_ID_LENGTH: 6,
  PUBLIC_DIR: `public`,
  USER_ARGV_INDEX: 2,
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  },
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
      method: `error`
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
      method: `info`
    }
  }
};
