'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);
const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const UserService = require(`../data-service/user`);

const sampleUser = {
  name: `Сидор Сидоров`,
  email: `sidorov@example.com`,
  password: `sidorov`,
  passwordRepeated: `sidorov`,
  avatar: `sidorov.jpg`
};

const createAPI = async (logging = false) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging});
  await initDB(mockDB);
  const app = express();
  app.use(express.json());
  user(app, new UserService(mockDB));

  return app;
};

describe(`API creates user if data is valid`, () => {
  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({...sampleUser});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    await request(app)
      .post(`/user`)
      .send({
        // дополнительный пользователь для проверки уникальности e-mail
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        password: `ivanov`,
        passwordRepeated: `ivanov`,
        avatar: `ivanov.jpg`
      });
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(sampleUser)) {
      const badUserData = {...sampleUser};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...sampleUser, firstName: true},
      {...sampleUser, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...sampleUser, password: `short`, passwordRepeated: `short`},
      {...sampleUser, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...sampleUser, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...sampleUser, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(StatusCodes.BAD_REQUEST);
  });
});
