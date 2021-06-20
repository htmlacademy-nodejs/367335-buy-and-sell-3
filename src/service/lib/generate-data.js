'use strict';

const {nanoid} = require(`nanoid`);
const bcrypt = require(`bcrypt`);
const {
  formatNumWithLead0,
  getRandomInt,
  getRandomItem
} = require(`../../utils`);

const SALT_ROUNDS = 10;
const EMAIL_DOMAINS = [`ru`, `com`, `net`, `academy`];
const IMG_EXTENSIONS = [`jpg`, `png`];

const EmailRestrict = {
  MIN: 4,
  MAX: 12
};

const PasswordRestrict = {
  MIN: 6,
  MAX: 12
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const generatePicture = () => {
  const imgLength = getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX);
  return `${nanoid(imgLength).toLowerCase()}.${getRandomItem(IMG_EXTENSIONS)}`;
};

const generatePeople = (name) => {
  const emailPrependLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const emailAppendLength = getRandomInt(EmailRestrict.MIN, EmailRestrict.MAX);
  const passwordLength = getRandomInt(PasswordRestrict.MIN, PasswordRestrict.MAX);
  return {
    name,
    email: `${nanoid(emailPrependLength)}@${nanoid(emailAppendLength)}.${getRandomItem(EMAIL_DOMAINS)}`,
    passwordHash: bcrypt.hashSync(nanoid(passwordLength), SALT_ROUNDS),
    avatar: generatePicture()
  };
};

const generateCategories = (categories) => categories.map((category, i) => ({
  title: category,
  picture: `cat${formatNumWithLead0(i + 1)}.jpg`
}));

module.exports = ({categories, offers, peoples}) => ({
  categories: generateCategories(categories),
  offers,
  peoples: peoples.map(generatePeople)
});
