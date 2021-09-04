'use strict';

const express = require(`express`);
const session = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const path = require(`path`);
const {StatusCodes} = require(`http-status-codes`);
const Constants = require(`../constants`);
const sequelize = require(`../service/lib/sequelize`);
const offersRouter = require(`./routes/offers`);
const myRouter = require(`./routes/my`);
const mainRouter = require(`./routes/main`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const IS_DEV = process.env.NODE_ENV === `development`;
const app = express();

const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});
sequelize.sync({force: false});

// для использования в шаблонизаторе
app.locals.C = {...Constants, IS_DEV};

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: sessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false
}));

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
