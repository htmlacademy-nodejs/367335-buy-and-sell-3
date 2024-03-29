'use strict';

const {ExitCode, OfferType} = require(`../../constants`);
const {
  formatNumWithLead0,
  getRandomInt,
  getRandomItem,
  getRandomItems,
  outputRes,
  writeFileToArray
} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {hashSync} = require(`../lib/password`);

const FILE_NAME = `fill-db.sql`;
const DEFAULT_OFFERS_COUNT = 5;
const FIRST_ID = 1;

const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  USERS: `./data/users.txt`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`
};

const EmailRestrict = {
  MIN: 4,
  MAX: 12
};
const emailDomains = [`ru`, `com`, `net`, `academy`];

const PasswordRestrict = {
  MIN: 6,
  MAX: 12
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};
const imgExtensions = [`jpg`, `png`];

const DescriptionsRestrict = {
  MIN: 1,
  MAX: 5
};

const SumRestrict = {
  MIN: 100,
  MAX: 100000
};

const CommentsRestrict = {
  MIN: 2,
  MAX: 8
};

const generatePicture = () => {
  const imgLength = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);
  return `'${nanoid(imgLength).toLowerCase()}.${getRandomItem(imgExtensions)}'`;
};

const generateUsers = (users) => users.map((user) => {
  const emailPrependLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const emailAppendLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const passwordLength = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  return [
    `'${user}'`,
    `'${nanoid(emailPrependLength)}@${nanoid(emailAppendLength)}.${getRandomItem(emailDomains)}'`,
    `'${hashSync(nanoid(passwordLength))}'`,
    generatePicture()
  ];
});

const generateCategories = (categories) => categories.map((category, i) => [
  `'${category}'`,
  `'cat${formatNumWithLead0(i + 1)}.jpg'`
]);

const generateOffers = (offersCount, usersCount, sentences, titles) => {
  return Array(offersCount).fill([]).map(() => [
    `'${getRandomItem(titles)}'`,
    `'${getRandomItems({list: sentences, Restrict: DescriptionsRestrict}).join(` `)}'`,
    generatePicture(),
    getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    `'${getRandomItem(Object.values(OfferType))}'`,
    getRandomInt(FIRST_ID, usersCount)
  ]);
};

const generateComments = (offersCount, usersCount, comments) => {
  const {MIN, MAX} = CommentsRestrict;
  const end = getRandomInt(MIN, comments.length - 1);

  return Array(offersCount).fill(1).reduce((acc, item, offerId) => [
    ...acc,
    ...Array(getRandomInt(MIN, MAX)).fill(offerId).map(() => [
      `'${getRandomItems({list: comments, end}).join(` `)}'`,
      getRandomInt(FIRST_ID, usersCount),
      offerId + 1
    ])
  ], []);
};

const generateOffersToCategories = (offersCount, categoriesCount) => {
  return Array(offersCount).fill(1).reduce((acc, item, offerId) => {
    const categoriesOfNewsCount = getRandomInt(FIRST_ID, categoriesCount);
    const rows = Array(categoriesOfNewsCount).fill(1).map(() => getRandomInt(FIRST_ID, categoriesCount));

    return [
      ...acc,
      ...(Array.from(new Set(rows))).map((categoryId) => [offerId + 1, categoryId])
    ];
  }, []);
};

const formatSqlValues = (rows) => `(${rows.map((row) => row.join(`, `)).join(`),\n(`)});`;

const generateSql = ({offersCount, users, categories, comments, sentences, titles}) => `-- Тестовое наполнение БД

-- Добавление пользователей
INSERT INTO public.users (name, email, passwordHash, avatar) VALUES
${formatSqlValues(generateUsers(users))}

-- Добавление категорий
INSERT INTO public.categories (title, picture) VALUES
${formatSqlValues(generateCategories(categories))}

-- Добавление объявлений
INSERT INTO public.offers (title, description, picture, sum, type, userId) VALUES
${formatSqlValues(generateOffers(offersCount, users.length, sentences, titles))}

-- Добавление комментариев
INSERT INTO public.comments (text, userId, offerId) VALUES
${formatSqlValues(generateComments(offersCount, users.length, comments))}

-- Связь объявлений с категориями
INSERT INTO public.OfferCategories (OfferId, CategoryId) VALUES
${formatSqlValues(generateOffersToCategories(offersCount, categories.length))}
`;

module.exports = {
  name: `--fill`,
  async run([countStr]) {
    const offersCount = Number.parseInt(countStr, 10) || DEFAULT_OFFERS_COUNT;

    if (offersCount > 1000) {
      outputRes(`Не больше 1000 объявлений`, `ERROR`);
      process.exit(ExitCode.ERROR);
    }

    const [users, categories, comments, sentences, titles] = await Promise.all([
      writeFileToArray(DataFilePath.USERS),
      writeFileToArray(DataFilePath.CATEGORIES),
      writeFileToArray(DataFilePath.COMMENTS),
      writeFileToArray(DataFilePath.SENTENCES),
      writeFileToArray(DataFilePath.TITLES)
    ]);
    const content = generateSql({offersCount, users, categories, comments, sentences, titles});

    try {
      await writeFile(FILE_NAME, content);
      outputRes(`Operation success. File created.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Can't write data to file...`, `ERROR`);
    }
  }
};
