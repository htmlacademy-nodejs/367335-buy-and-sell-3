'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentsService = require(`../data-service/comment`);
const mockData = require(`./offer.e2e.test.json`);
const sampleOffer = {
  category: `Котики`,
  title: `Дам погладить котика`,
  description: `Дам погладить котика. Дорого. Не гербалайф`,
  picture: `cat.jpg`,
  type: `OFFER`,
  sum: 100500
};
const sampleKeys = Object.keys(sampleOffer);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new DataService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "DMxd2s"`, () => expect(response.body[0].id).toBe(`DMxd2s`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/DMxd2s`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Offer's title is "Научу писать рандомную фигню за 50 рублей"`, () => {
    expect(response.body.title).toBe(`Научу писать рандомную фигню за 50 рублей`);
  });
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, () => request(app).get(`/offers`).expect((res) => {
    expect(res.body.length).toBe(6);
  }));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of sampleKeys) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app).post(`/offers`).send(badOffer).expect(StatusCodes.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = JSON.parse(JSON.stringify(sampleOffer));
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/DMxd2s`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, () => request(app).get(`/offers/DMxd2s`).expect((res) => {
    expect(res.body.title).toBe(`Дам погладить котика`);
  }));
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };
  const app = createAPI();

  return request(app).put(`/offers/NOEXST`).send(validOffer).expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, () => {
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };
  const app = createAPI();

  return request(app).put(`/offers/DMxd2s`).send(invalidOffer).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/-6XwLE`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`-6XwLE`));
  test(`Offer count is 4 now`, () => request(app).get(`/offers`).expect((res) => {
    expect(res.body.length).toBe(4);
  }));
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/NOEXST`).expect(StatusCodes.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/exnrno/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is "2PdaTb"`, () => expect(response.body[0].id).toBe(`2PdaTb`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/exnrno/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/offers/exnrno/comments`).expect((res) => {
    expect(res.body.length).toBe(3);
  }));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app).post(`/offers/NOEXST/comments`).send({
    text: `Неважно`
  }).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app).post(`/offers/exnrno/comments`).send({}).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/exnrno/comments/CQv7PM`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`CQv7PM`));
  test(`Comments count is 1 now`, () => request(app).get(`/offers/exnrno/comments`).expect((res) => {
    expect(res.body.length).toBe(1);
  }));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/offers/GxdTgz/comments/NOEXST`).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NOEXST/comments/CQv7PM`)
    .expect(StatusCodes.NOT_FOUND);
});
