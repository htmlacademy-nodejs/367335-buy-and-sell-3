'use strict';

const {ExitCode, OfferType} = require(`../../constants`);
const {
  getRandomInt,
  getRandomItem,
  getRandomItems,
  formatNumWithLead0,
  writeFileToArray
} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const initDB = require(`../lib/init-db`);
const generateData = require(`../lib/generate-data`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_COUNT = 1;
const FIRST_ID = 1;
const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  USERS: `./data/users.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
};

const DescriptionsRestrict = {
  MIN: 1,
  MAX: 5
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 4
};

const logger = getLogger({name: `filldb`});

const exitWithError = (err) => {
  logger.error(err.message ? `An error occured: ${err.message}` : err);
  process.exit(ExitCode.ERROR);
};

const generateComments = ({comments, count, usersCount}) => {
  const end = getRandomInt(DEFAULT_COUNT, comments.length - 1);
  return Array(count).fill({}).map(() => ({
    text: getRandomItems({list: comments, end}).join(` `),
    userId: getRandomInt(FIRST_ID, usersCount)
  }));
};

const generateOffers = ({count, categories, comments, sentences, titles, usersCount}) => {
  return Array(count).fill({}).map(() => ({
    categories: getRandomItems({
      list: categories,
      end: getRandomInt(DEFAULT_COUNT, categories.length - 1)
    }),
    comments: generateComments({comments, count: getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), usersCount}),
    description: getRandomItems({list: sentences, Restrict: DescriptionsRestrict}).join(` `),
    picture: `item${formatNumWithLead0(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))}.jpg`,
    title: getRandomItem(titles),
    type: getRandomItem(Object.values(OfferType)),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    userId: getRandomInt(FIRST_ID, usersCount)
  }));
};

module.exports = {
  name: `--filldb`,
  generateData,
  async run([countStr]) {
    const count = Number.parseInt(countStr, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      exitWithError(`No more than 1000 offers`);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      exitWithError(err);
    }
    logger.info(`Connection to database established`);

    const [categories, comments, sentences, titles, users] = await Promise.all([
      writeFileToArray(DataFilePath.CATEGORIES),
      writeFileToArray(DataFilePath.COMMENTS),
      writeFileToArray(DataFilePath.SENTENCES),
      writeFileToArray(DataFilePath.TITLES),
      writeFileToArray(DataFilePath.USERS)
    ]);

    try {
      await initDB(sequelize, generateData({
        categories,
        offers: generateOffers({
          count,
          categories,
          comments,
          sentences,
          titles,
          usersCount: users.length
        }),
        users
      }));
    } catch (err) {
      exitWithError(err);
    }

    logger.info(`Operation success. DB created and filled.`);
  }
};
