'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const mockData = require(`./category.e2e.test.json`);
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
