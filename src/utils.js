'use strict';

const {LogMode} = require(`./constants`);
const chalk = require(`chalk`);
const {readFile} = require(`fs`).promises;

/**
 * Выводит число с ведущим нулем для цифры
 *
 * @param {Number} num
 * @return {String}
 */
const formatNumWithLead0 = (num) => `${(num < 10) ? `0` : ``}${num}`;

/**
 * Возвращает случайное число в диапазоне
 * `min` и `max`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Возвращает случайный элемент заданного массива
 *
 * @param {Array} someArray
 * @return {*}
 */
const getRandomItem = (someArray) => someArray[getRandomInt(0, someArray.length - 1)];

/**
 * Выводит результат в консоль в зависимости от режима из справочника `LogMode`
 *
 * @param {*} res
 * @param {String} [modeName=`DEFAULT`]
 */
const outputRes = (res, modeName = `DEFAULT`) => {
  const {method, color} = LogMode[modeName];
  console[method](chalk[color](res));
};

/**
 * Возврашает массив строк файла
 * Пустые строки и строки из одних пробельных символов игнорируются
 *
 * @param {String} filePath
 * @return {Array}
 */
const readContent = async (filePath) => {
  try {
    const content = await readFile(filePath, `utf8`);
    return content.split(`\n`).filter((item) => item.trim());
  } catch (err) {
    outputRes(err, `ERROR`);
    return [];
  }
};

/**
 * Перетасовка массива по алгоритму Фишера—Йетса.
 *
 * @param {Array} array
 * @return {Array}
 */
const shuffle = (array) => {
  const resultArray = array.slice();
  for (let i = resultArray.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [resultArray[randomNumber], resultArray[i]] = [resultArray[i], resultArray[randomNumber]];
  }

  return resultArray;
};

/**
 * Возвращает случайную последовательность элементов массива заданного размера
 *
 * @param {*} {
 *   list = [],
 *   start = 0,
 *   end = 0,
 *   Restrict = {}
 * }
 * @return {Array}
 */
const getRandomItems = ({
  list = [],
  start = 0,
  end = 0,
  Restrict = {}
}) => shuffle(list.slice()).slice(Restrict.MIN || start, Restrict.MAX || end);

module.exports = {
  formatNumWithLead0,
  getRandomInt,
  getRandomItem,
  getRandomItems,
  outputRes,
  readContent,
  shuffle
};
