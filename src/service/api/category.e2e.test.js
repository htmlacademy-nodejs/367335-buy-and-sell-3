'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);

const initDB = require(`../lib/init-db`);
const generateData = require(`../lib/generate-data`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);

const mockCategories = [`Софт`, `Игры`, `Книги`, `Любовные романы`, `Юмор`, `Хит`, `Пословицы`, `Журналы`, `Животные`, `Политика`, `Разное`, `Посуда`];
const mockUsers = [`Андрей Рогов`, `Арсений Петухов`];

const mockOffers = [
  {
    categories: [
      `Софт`,
      `Игры`,
      `Книги`,
      `Любовные романы`,
      `Юмор`,
      `Хит`,
      `Пословицы`
    ],
    comments: [
      {
        text: `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      {
        text: `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ],
    description: `Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию.`,
    picture: `item03.jpg`,
    title: `Куплю антиквариат`,
    type: `buy`,
    sum: 1986
  },
  {
    categories: [
      `Книги`,
      `Журналы`,
      `Животные`,
      `Политика`
    ],
    comments: [
      {
        text: `А где блок питания? А сколько игр в комплекте? Неплохо, но дорого.`
      },
      {
        text: `Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`
      }
    ],
    description: `Даю недельную гарантию. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Если найдётся хозяин товара, валите всё на нас.`,
    picture: `item01.jpg`,
    title: `Отдам почетные грамоты даром`,
    type: `sell`,
    sum: 87390
  },
  {
    categories: [
      `Разное`,
      `Посуда`
    ],
    comments: [
      {
        text: `Продаю в связи с переездом. Отрываю от сердца. Совсем немного...`
      },
      {
        text: `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Товар в отличном состоянии. Второй товар на 50% дешевле. Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки.`,
    picture: `item05.jpg`,
    title: `Консультирую по вопросам бихейвиоризма`,
    type: `buy`,
    sum: 29941
  },
  {
    categories: [
      `Юмор`,
      `Разное`,
      `Журналы`,
      `Хит`,
      `Животные`,
      `Политика`
    ],
    comments: [
      {
        text: `Неплохо, но дорого.`
      },
      {
        text: `Оплата наличными или перевод на карту?`
      },
      {
        text: `Почему в таком ужасном состоянии?`
      }
    ],
    description: `Скидки в честь Дня конституции. Это настоящая находка для коллекционера! Самовывоз в течение дня, вход без масок запрещён. Бонусом отдам все аксессуары.`,
    picture: `item06.jpg`,
    title: `Продам отличную подборку фильмов на VHS`,
    type: `buy`,
    sum: 63064
  },
  {
    categories: [
      `Юмор`,
      `Журналы`,
      `Разное`,
      `Игры`
    ],
    comments: [
      {
        text: `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Самовывоз в течение дня, вход без масок запрещён. Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам. Второй товар на 50% дешевле.`,
    picture: `item10.jpg`,
    title: `Куплю мясо по оптовой цене`,
    type: `sell`,
    sum: 7871
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());
beforeAll(async () => {
  await initDB(mockDB, generateData({categories: mockCategories, offers: mockOffers, users: mockUsers}));
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 12 categories`, () => expect(response.body.length).toBe(12));
  test(`Category names are "${mockCategories.join(`", "`)}"`, () => {
    expect(response.body.map((categoryData) => categoryData.title)).toEqual(expect.arrayContaining(mockCategories));
  });
});
