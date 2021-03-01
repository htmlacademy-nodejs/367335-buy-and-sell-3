'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);

const initDB = require(`../lib/init-db`);
const generateData = require(`../lib/generate-data`);
const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentsService = require(`../data-service/comment`);

const mockPeoples = [`Андрей Рогов`, `Арсений Петухов`];
const mockCategories = [`Софт`, `Игры`, `Книги`, `Любовные романы`, `Юмор`, `Хит`, `Пословицы`, `Журналы`, `Животные`, `Политика`, `Разное`, `Посуда`];
const mockOffers = [
  {
    categories: [
      `Юмор`,
      `Разное`,
      `Любовные романы`,
      `Игры`,
      `Книги`,
      `Софт`
    ],
    comments: [
      {
        text: `А где блок питания? Продаю в связи с переездом. Отрываю от сердца. Совсем немного... Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`
      },
      {
        text: `Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте? Почему в таком ужасном состоянии? А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого.`
      },
      {
        text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Неплохо, но дорого. А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        text: `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту? Неплохо, но дорого. А где блок питания? С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии?`
      }
    ],
    description: `Товар в отличном состоянии. Второй товар на 50% дешевле. Продаю с болью в сердце... Самовывоз в течение дня, вход без масок запрещён.`,
    picture: `item15.jpg`,
    title: `Научу писать рандомную фигню за 50 рублей`,
    type: `buy`,
    sum: 28275,
    peopleId: 1
  },
  {
    categories: [
      `Софт`,
      `Посуда`,
      `Любовные романы`,
      `Журналы`
    ],
    comments: [
      {
        text: `Оплата наличными или перевод на карту?`
      }
    ],
    description: `Бонусом отдам все аксессуары. Таких предложений больше нет! Если найдётся хозяин товара, валите всё на нас. Самовывоз в течение дня, вход без масок запрещён.`,
    picture: `item06.jpg`,
    title: `Продам отличную подборку фильмов на VHS`,
    type: `sell`,
    sum: 1715,
    peopleId: 1
  },
  {
    categories: [
      `Юмор`,
      `Любовные романы`,
      `Книги`,
      `Игры`,
      `Пословицы`,
      `Животные`,
      `Хит`,
      `Политика`,
      `Софт`,
      `Разное`,
      `Журналы`
    ],
    comments: [
      {
        text: `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии? А где блок питания? А сколько игр в комплекте? Неплохо, но дорого. С чем связана продажа? Почему так дешёво? Совсем немного...`
      },
      {
        text: `Совсем немного... Почему в таком ужасном состоянии? Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца. А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого. А сколько игр в комплекте?`
      },
      {
        text: `Совсем немного... Неплохо, но дорого. Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле. А сколько игр в комплекте? С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {
        text: `С чем связана продажа? Почему так дешёво? Почему в таком ужасном состоянии? А где блок питания? А сколько игр в комплекте? Совсем немного... Вы что?! В магазине дешевле. Неплохо, но дорого. Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Если найдёте дешевле — сброшу цену. Пользовались бережно и только по большим праздникам. Самовывоз в течение дня, вход без масок запрещён. Второй товар на 50% дешевле.`,
    picture: `item15.jpg`,
    title: `Продам новую приставку Sony Playstation 5`,
    type: `buy`,
    sum: 75652,
    peopleId: 1
  },
  {
    categories: [
      `Политика`,
      `Книги`,
      `Журналы`,
      `Юмор`,
      `Разное`,
      `Софт`,
      `Игры`,
      `Животные`,
      `Хит`,
      `Посуда`
    ],
    comments: [
      {
        text: `Совсем немного... Почему в таком ужасном состоянии? Неплохо, но дорого. А где блок питания? Оплата наличными или перевод на карту? А сколько игр в комплекте?`
      },
      {
        text: `Оплата наличными или перевод на карту? Вы что?! В магазине дешевле. А сколько игр в комплекте? С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?`
      }
    ],
    description: `Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки. Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену.`,
    picture: `item12.jpg`,
    title: `Научу писать рандомную фигню за 50 рублей`,
    type: `buy`,
    sum: 40899,
    peopleId: 1
  },
  {
    categories: [
      `Хит`
    ],
    comments: [
      {
        text: `Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    description: `Скидки в честь Дня конституции. Самовывоз в течение дня, вход без масок запрещён. Если найдётся хозяин товара, валите всё на нас. Если товар не понравится — верну всё до последней копейки.`,
    picture: `item02.jpg`,
    title: `Научу писать рандомную фигню за 50 рублей`,
    type: `sell`,
    sum: 49628,
    peopleId: 1
  }
];
const sampleOffer = {
  categories: [1, 2],
  title: `Дам погладить котика`,
  description: `Дам погладить котика. Дорого. Не гербалайф`,
  picture: `cat.jpg`,
  type: `buy`,
  sum: 100500,
  peopleId: 1
};
const sampleKeys = Object.keys(sampleOffer);

const createAPI = async (logging = false) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging});
  await initDB(mockDB, generateData({
    categories: mockCategories.slice(),
    offers: mockOffers.slice(),
    peoples: mockPeoples.slice()
  }));
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockDB), new CommentsService(mockDB));

  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals 1`, () => expect(response.body[0].id).toBe(1));
});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Offer's title is "Научу писать рандомную фигню за 50 рублей"`, () => {
    expect(response.body.title).toBe(`Научу писать рандомную фигню за 50 рублей`);
  });
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Offers count is changed`, () => request(app).get(`/offers`).expect((res) => {
    expect(res.body.length).toBe(6);
  }));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));

  test(`Without any required property response code is 400`, async () => {
    const app = await createAPI();

    for (const key of sampleKeys) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app).post(`/offers`).send(badOffer).expect(StatusCodes.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/offers/1`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Offer is really changed`, () => request(app).get(`/offers/1`).expect((res) => {
    expect(res.body.title).toBe(`Дам погладить котика`);
  }));
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const validOffer = {
    categories: [1],
    title: `Это валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404,
    peopleId: 1
  };
  const app = await createAPI();

  return request(app).put(`/offers/99999`).send(validOffer).expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = {
    categories: [1],
    title: `Это невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`,
    peopleId: 1
  };
  const app = await createAPI();

  return request(app).put(`/offers/1`).send(invalidOffer).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/5`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Offer count is 4 now`, () => request(app).get(`/offers`).expect((res) => {
    expect(res.body.length).toBe(4);
  }));
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();

  return request(app).delete(`/offers/99999`).expect(StatusCodes.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 4 comments`, () => expect(response.body.length).toBe(4));
  test(`First comment's text is "А где блок питания? Продаю в связи с переездом. Отрываю от сердца. Совсем немного... Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?"`, () => expect(response.body[0].text).toBe(`А где блок питания? Продаю в связи с переездом. Отрываю от сердца. Совсем немного... Почему в таком ужасном состоянии? Неплохо, но дорого. С чем связана продажа? Почему так дешёво?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Comments count is changed`, () => request(app).get(`/offers/1/comments`).expect((res) => {
    expect(res.body.length).toBe(5);
  }));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app).post(`/offers/99999/comments`).send({
    text: `Неважно`
  }).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app).post(`/offers/1/comments`).send({}).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Comments count is 3 now`, () => request(app).get(`/offers/1/comments`).expect((res) => {
    expect(res.body.length).toBe(3);
  }));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app).delete(`/offers/1/comments/999`).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/99999/comments/1`)
    .expect(StatusCodes.NOT_FOUND);
});
