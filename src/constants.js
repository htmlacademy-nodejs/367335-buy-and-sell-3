'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  DEFAULT_PORT: 8080,
  DEFAULT_LOCAL_PORT: 3000,
  FILE_NAME: `mocks.json`,
  NOT_FOUND_MSG: `Not found`,
  USER_ARGV_INDEX: 2,
  ExitCode: {
    ERROR: 1,
    SUCCESS: 0
  },
  HttpCode: {
    OK: 200,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
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
  },
  Services: {
    LOGIN: {
      alias: `login`
    },
    MY: {
      alias: `my`
    },
    OFFERS: {
      alias: `offers`
    },
    REGISTER: {
      alias: `register`
    },
    SEARCH: {
      alias: `search`
    }
  }
};
