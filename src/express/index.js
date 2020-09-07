'use strict';

const express = require(`express`);
const path = require(`path`);
const {DEFAULT_PORT, PUBLIC_DIR} = require(`../constants`);
const offersRouter = require(`./routes/offers`);
const myRouter = require(`./routes/my`);
const indexRouter = require(`./routes/index`);
const app = express();

app.use(`/offers`, offersRouter);
app.use(`/my`, myRouter);
app.use(`/`, indexRouter);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => res.status(400).render(`400`));
app.use((err, req, res, next) => {
  res.status(500).render(`500`);
  next();
});

app.set(`views`, path.resolve(__dirname, `templates/entries`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
