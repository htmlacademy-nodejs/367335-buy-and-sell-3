'use strict';

const {ExitCode, FILE_NAME, GENERATED_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, getRandomItem, getRandomItems, formatNumWithLead0, outputRes, readContent} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const DEFAULT_COUNT = 1;
const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`
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

const generateComments = ({comments, count}) => {
  const end = getRandomInt(DEFAULT_COUNT, comments.length - 1);
  return Array(count).fill({}).map(() => ({
    id: nanoid(GENERATED_ID_LENGTH),
    text: getRandomItems({list: comments, end}).join(` `),
  }));
};

const generateOffers = ({count, categories, comments, sentences, titles}) => (Array(count).fill({}).map(() => ({
  id: nanoid(GENERATED_ID_LENGTH),
  category: getRandomItems({list: categories, end: getRandomInt(DEFAULT_COUNT, categories.length - 1)}),
  comments: generateComments({comments, count: getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX)}),
  description: getRandomItems({list: sentences, Restrict: DescriptionsRestrict}).join(` `),
  picture: `item${formatNumWithLead0(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))}.jpg`,
  title: getRandomItem(titles),
  type: getRandomItem(Object.values(OfferType)),
  sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX)
})));

module.exports = {
  name: `--generate`,
  async run([countStr]) {
    const count = Number.parseInt(countStr, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      outputRes(`Не больше 1000 объявлений`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }

    const categories = await readContent(DataFilePath.CATEGORIES);
    const comments = await readContent(DataFilePath.COMMENTS);
    const sentences = await readContent(DataFilePath.SENTENCES);
    const titles = await readContent(DataFilePath.TITLES);
    const content = generateOffers({count, categories, comments, sentences, titles});

    try {
      await writeFile(FILE_NAME, JSON.stringify(content));
      outputRes(`Operation success. File created.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Can't write data to file...`, `ERROR`);
    }
  }
};
