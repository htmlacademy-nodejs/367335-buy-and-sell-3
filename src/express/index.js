'use strict';

const express = require(`express`);
const {DEFAULT_PORT, Services} = require(`../constants`);
const servicesList = Object.keys(Services);

const app = express();

app.use(`/`, require(`./routes/index`));
for (const service of servicesList) {
  const {alias} = Services[service];
  app.use(`/${alias}`, require(`./routes/${alias}`));
}

app.listen(DEFAULT_PORT);
