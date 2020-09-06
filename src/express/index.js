'use strict';

const express = require(`express`);
const {DEFAULT_PORT} = require(`../constants`);
const offersRouter = require(`./routes/offers`);
const myRouter = require(`./routes/my`);
const indexRouter = require(`./routes/index`);
const app = express();

app.use(`/offers`, offersRouter);
app.use(`/my`, myRouter);
app.use(`/`, indexRouter);

app.listen(DEFAULT_PORT);
