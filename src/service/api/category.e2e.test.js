'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const mockData = [
  {
    id: `pBQYra`,
    category: [
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
        id: `Hi-yI9`,
        text: `С чем связана продажа? Почему так дешёво? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      {
        id: `WUPrFt`,
        text: `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      }
    ],
    description: `Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию.`,
    picture: `item03.jpg`,
    title: `Куплю антиквариат`,
    type: `offer`,
    sum: 1986
  },
  {
    id: `A0iiyQ`,
    category: [
      `Книги`,
      `Журналы`,
      `Животные`,
      `Политика`
    ],
    comments: [
      {
        id: `8cVZgn`,
        text: `А где блок питания? А сколько игр в комплекте? Неплохо, но дорого.`
      },
      {
        id: `nbbDrd`,
        text: `Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Вы что?! В магазине дешевле.`
      }
    ],
    description: `Даю недельную гарантию. Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Если найдётся хозяин товара, валите всё на нас.`,
    picture: `item01.jpg`,
    title: `Отдам почетные грамоты даром`,
    type: `sale`,
    sum: 87390
  },
  {
    id: `vdv9wu`,
    category: [
      `Разное`,
      `Посуда`
    ],
    comments: [
      {
        id: `QsPY6h`,
        text: `Продаю в связи с переездом. Отрываю от сердца. Совсем немного...`
      },
      {
        id: `3eqKUq`,
        text: `Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Товар в отличном состоянии. Второй товар на 50% дешевле. Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки.`,
    picture: `item05.jpg`,
    title: `Консультирую по вопросам бихейвиоризма`,
    type: `offer`,
    sum: 29941
  },
  {
    id: `Q4-Z8D`,
    category: [
      `Юмор`,
      `Разное`,
      `Журналы`,
      `Хит`,
      `Животные`,
      `Политика`
    ],
    comments: [
      {
        id: `7RM4Hn`,
        text: `Неплохо, но дорого.`
      },
      {
        id: `YbWxxe`,
        text: `Оплата наличными или перевод на карту?`
      },
      {
        id: `PedWGc`,
        text: `Почему в таком ужасном состоянии?`
      }
    ],
    description: `Скидки в честь Дня конституции. Это настоящая находка для коллекционера! Самовывоз в течение дня, вход без масок запрещён. Бонусом отдам все аксессуары.`,
    picture: `item06.jpg`,
    title: `Продам отличную подборку фильмов на VHS`,
    type: `offer`,
    sum: 63064
  },
  {
    id: `74EUns`,
    category: [
      `Юмор`,
      `Журналы`,
      `Разное`,
      `Игры`
    ],
    comments: [
      {
        id: `7_3VQL`,
        text: `Почему в таком ужасном состоянии? Вы что?! В магазине дешевле. Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Самовывоз в течение дня, вход без масок запрещён. Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам. Второй товар на 50% дешевле.`,
    picture: `item10.jpg`,
    title: `Куплю мясо по оптовой цене`,
    type: `sale`,
    sum: 7871
  }
];
const expectedList = [`Софт`, `Игры`, `Книги`, `Любовные романы`, `Юмор`, `Хит`, `Пословицы`, `Журналы`, `Животные`, `Политика`, `Разное`, `Посуда`];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 12 categories`, () => expect(response.body.length).toBe(12));
  test(`Category names are "${expectedList.join(`", "`)}"`, () => {
    expect(response.body).toEqual(expect.arrayContaining(expectedList));
  });
});
