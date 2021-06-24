'use strict';

const express = require(`express`);
const path = require(`path`);
const {StatusCodes} = require(`http-status-codes`);
const Constants = require(`../constants`);
const offersRouter = require(`./routes/offers`);
const myRouter = require(`./routes/my`);
const mainRouter = require(`./routes/main`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const IS_DEV = process.env.NODE_ENV === `development`;
const app = express();

// для использования в шаблонизаторе
app.locals.C = {...Constants, IS_DEV};

app.use(express.urlencoded({extended: false}));

app.use(`/offers`, offersRouter);
app.use(`/my`, myRouter);
app.use(`/`, mainRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => res.status(StatusCodes.BAD_REQUEST).render(`400`));
app.use((err, req, res, _next) => {
  if (IS_DEV) {
    console.error(err); // для визуализации ошибок шаблонизатора
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).render(`500`);
});

app.set(`views`, path.resolve(__dirname, `templates/entries`));
app.set(`view engine`, `pug`);

app.listen(process.env.PORT || Constants.DEFAULT_PORT);
