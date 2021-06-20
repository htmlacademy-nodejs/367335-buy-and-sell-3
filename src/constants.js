'use strict';

module.exports = {
  DEFAULT_PORT: 8080,
  DEFAULT_API_PORT: 3000,
  USER_ARGV_INDEX: 2,
  USERNAME_PATTERN: `^[А-ЯА-яЁёA-Za-z ]{1,100}$`,
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
  },
  OfferType: {
    OFFER: `buy`,
    SALE: `sell`
  },
  MinValue: {
    OFFER_TITLE: 10,
    OFFER_TEXT: 50,
    COMMENT: 20,
    PASSWORD: 6,
    SUM: 100
  },
  MaxValue: {
    USERNAME: 100,
    EMAIL: 100,
    CATEGORY: 50,
    OFFER_TITLE: 100,
    OFFER_TEXT: 1000,
    COMMENT: 400,
    PASSWORD: 128,
    FILENAME: 256
  },
  HttpMethod: {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`
  }
};
