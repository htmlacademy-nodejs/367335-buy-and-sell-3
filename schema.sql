DROP DATABASE IF EXISTS buy_and_sell;
CREATE DATABASE buy_and_sell
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TABLESPACE = pg_default
  TEMPLATE template0
  CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS OfferCategories;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS action;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  name VARCHAR (100) NOT NULL,
  email VARCHAR (100) NOT NULL UNIQUE,
  passwordHash CHAR (128) NOT NULL,
  avatar VARCHAR (256) NOT NULL UNIQUE
);

CREATE TABLE categories (
	id SMALLSERIAL PRIMARY KEY,
  title VARCHAR (50) NOT NULL,
  picture VARCHAR (256) UNIQUE
);

CREATE TYPE action AS ENUM('buy', 'sell');
CREATE TABLE offers (
	id SERIAL PRIMARY KEY,
  title VARCHAR (100) NOT NULL,
  description VARCHAR (1000) NOT NULL,
  picture VARCHAR (256),
  pubDate date NOT NULL DEFAULT current_date,
  sum INTEGER NOT NULL DEFAULT 100,
  type action,
  userId INTEGER NOT NULL,
	FOREIGN KEY (userId) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
CREATE INDEX ON offers(title);

CREATE TABLE OfferCategories (
  OfferId INTEGER NOT NULL,
  CategoryId SMALLINT NOT NULL,
	CONSTRAINT OfferCategories_pk PRIMARY KEY (OfferId, CategoryId),
	FOREIGN KEY (OfferId) REFERENCES offers (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (CategoryId) REFERENCES categories (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
  text VARCHAR (400) NOT NULL,
  userId INTEGER NOT NULL,
  offerId INTEGER NOT NULL,
	FOREIGN KEY (userId) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (offerId) REFERENCES offers (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
