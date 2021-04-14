'use strict';

const {ExitCode, OfferType} = require(`../../constants`);
const {getRandomInt, getRandomItem, getRandomItems, outputRes, writeFileToArray} = require(`../../utils`);
const {writeFile} = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const bcrypt = require(`bcrypt`);

const FILE_NAME = `fill-db.sql`;
const DEFAULT_OFFERS_COUNT = 5;
const SALT_ROUNDS = 10;
const FIRST_ID = 1;

const DataFilePath = {
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  PEOPLES: `./data/peoples.txt`,
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

const generatePeoples = (peoples) => peoples.map((user) => {
  const emailPrependLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const emailAppendLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const passwordLength = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  return [
    `'${user}'`,
    `'${nanoid(emailPrependLength)}@${nanoid(emailAppendLength)}.${getRandomItem(emailDomains)}'`,
    `'${bcrypt.hashSync(nanoid(passwordLength), SALT_ROUNDS)}'`,
    generatePicture()
  ];
});

const generateCategories = (categories) => categories.map((category) => [
  `'${category}'`,
  generatePicture()
]);

const generateOffers = (offersCount, peoplesCount, sentences, titles) => {
  return Array(offersCount).fill([]).map(() => [
    `'${getRandomItem(titles)}'`,
    `'${getRandomItems({list: sentences, Restrict: DescriptionsRestrict}).join(` `)}'`,
    generatePicture(),
    getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    `'${getRandomItem(Object.values(OfferType))}'`,
    getRandomInt(FIRST_ID, peoplesCount)
  ]);
};

const generateComments = (offersCount, peoplesCount, comments) => {
  const {MIN, MAX} = CommentsRestrict;
  const end = getRandomInt(MIN, comments.length - 1);

  return Array(offersCount).fill(1).reduce((acc, item, offerId) => [
    ...acc,
    ...Array(getRandomInt(MIN, MAX)).fill(offerId).map(() => [
      `'${getRandomItems({list: comments, end}).join(` `)}'`,
      getRandomInt(FIRST_ID, peoplesCount),
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

const generateSql = ({offersCount, peoples, categories, comments, sentences, titles}) => `-- Тестовое наполнение БД

-- Добавление пользователей
INSERT INTO public.peoples (name, email, password_hash, avatar) VALUES
${formatSqlValues(generatePeoples(peoples))}

-- Добавление категорий
INSERT INTO public.categories (title, picture) VALUES
${formatSqlValues(generateCategories(categories))}

-- Добавление объявлений
INSERT INTO public.offers (title, description, picture, sum, type, people_id) VALUES
${formatSqlValues(generateOffers(offersCount, peoples.length, sentences, titles))}

-- Добавление комментариев
INSERT INTO public.comments (text, people_id, offer_id) VALUES
${formatSqlValues(generateComments(offersCount, peoples.length, comments))}

-- Связь объявлений с категориями
INSERT INTO public.offers_categories (offer_id, category_id) VALUES
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

    const [peoples, categories, comments, sentences, titles] = await Promise.all([
      writeFileToArray(DataFilePath.PEOPLES),
      writeFileToArray(DataFilePath.CATEGORIES),
      writeFileToArray(DataFilePath.COMMENTS),
      writeFileToArray(DataFilePath.SENTENCES),
      writeFileToArray(DataFilePath.TITLES)
    ]);
    const content = generateSql({offersCount, peoples, categories, comments, sentences, titles});

    try {
      await writeFile(FILE_NAME, content);
      outputRes(`Operation success. File created.`, `SUCCESS`);
    } catch (err) {
      outputRes(`Can't write data to file...`, `ERROR`);
    }
  }
};
