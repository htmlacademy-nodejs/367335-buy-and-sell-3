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
DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS peoples;
DROP TYPE IF EXISTS action;

CREATE TABLE peoples (
	id SERIAL PRIMARY KEY,
  name VARCHAR (100) NOT NULL,
  email VARCHAR (100) NOT NULL UNIQUE,
  password_hash CHAR (128) NOT NULL,
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
  picture VARCHAR (256) NOT NULL DEFAULT 'stub.jpg',
  pub_date date NOT NULL DEFAULT current_date,
  sum SMALLINT NOT NULL DEFAULT 100,
  type action,
  people_id INTEGER NOT NULL,
	FOREIGN KEY (people_id) REFERENCES peoples (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE offers_categories (
  offer_id INTEGER NOT NULL,
  category_id SMALLINT NOT NULL,
	CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id),
	FOREIGN KEY (offer_id) REFERENCES offers (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
  text VARCHAR (400) NOT NULL,
  people_id INTEGER NOT NULL,
  offer_id INTEGER NOT NULL,
	FOREIGN KEY (people_id) REFERENCES peoples (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (offer_id) REFERENCES offers (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
