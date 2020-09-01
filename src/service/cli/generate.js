'use strict';

const {ExitCode, FILE_NAME} = require(`../../constants`);
const {getRandomInt, getRandomItem, formatNumWithLead0, outputRes, readContent, shuffle} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;

const DEFAULT_COUNT = 1;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000
};

const generateOffers = ({count, categories, sentences, titles}) => (Array(count).fill({}).map(() => ({
  category: shuffle(categories).slice(0, getRandomInt(0, categories.length - 1) || 1),
  description: shuffle(sentences).slice(1, 5).join(` `),
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

    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const content = generateOffers({count, categories, sentences, titles});

    try {
      await writeFile(FILE_NAME, JSON.stringify(content));
      outputRes(`Operation success. File created.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Can't write data to file...`, `ERROR`);
    }
  }
};
