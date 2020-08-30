'use strict';

const {ExitCode} = require(`../../constants`);
const {getRandomInt, getRandomItem, formatNumWithLead0, outputRes, shuffle} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

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

const generateOffers = (count) => (Array(count).fill({}).map(() => ({
  category: shuffle(CATEGORIES).slice(0, getRandomInt(0, CATEGORIES.length - 1) || 1),
  description: shuffle(SENTENCES).slice(1, 5).join(` `),
  picture: `item${formatNumWithLead0(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))}.jpg`,
  title: getRandomItem(TITLES),
  type: getRandomItem(Object.values(OfferType)),
  sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX)
})));

module.exports = {
  name: `--generate`,
  async run([countStr]) {
    const count = +countStr || DEFAULT_COUNT;

    if (count > 1000) {
      outputRes(`Не больше 1000 объявлений`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }

    try {
      await writeFile(FILE_NAME, JSON.stringify(generateOffers(count)));
      outputRes(`Operation success. File created.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Can't write data to file...`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }
  }
};
