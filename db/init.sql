-- -----------------------------
-- Creates database
-- -----------------------------
CREATE DATABASE ebot;

-- -----------------------------
-- Creates tables
-- -----------------------------
-- CREATE TABLE accounts(
-- 	id SERIAL PRIMARY KEY,
-- 	type INT NOT NULL
-- );

-- ----------------------------------------------------
-- Table 'ebot'.'sellers'
-- ----------------------------------------------------
CREATE TABLE sellers(
	id SERIAL PRIMARY KEY,
	apiKey VARCHAR(50) NOT NULL,
	store_name VARCHAR(50) NOT NULL,
	email TEXT NOT NULL,
	password_ TEXT NOT NULL
);

-- ----------------------------------------------------
-- Table 'categories'.'sellers'
-- ----------------------------------------------------
CREATE TABLE categories(
	id SERIAL PRIMARY KEY,
	category_name VARCHAR(150) NOT NULL,
);

-- ----------------------------------------------------
-- Table 'products'.'sellers'
-- ----------------------------------------------------
CREATE TABLE products(
	id SERIAL PRIMARY KEY,
	product_name VARCHAR(150) NOT NULL,
	seller_id INT REFERENCES sellers(id) NOT NULL,
	category_id int REFERENCES categories(id) NOT NULL,
	brand VARCHAR(50) NOT NULL,
	url VARCHAR(350) NOT NULL,
	price MONEY NOT NULL,
	old_price MONEY NOT NULL,
	image_url VARCHAR(350) NOT NULL,
	details TEXT,
	availability BOOLEAN NOT NULL,
	last_updated DATE NOT NULL
);

-- ----------------------------------------------------
-- Table 'users'.'sellers'
-- ----------------------------------------------------
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	-- account_id INT references accounts(id) NOT NULL,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	email TEXT NOT NULL,
	password_ TEXT NOT NULL,
	username VARCHAR(50) NOT NULL
);

ALTER TABLE categories ADD product_id INT REFERENCES products(id);

-- ALTER TABLE sellers ADD account_id INT REFERENCES accounts(id);


CREATE TABLE addresses(
	id SERIAL PRIMARY KEY,
	address TEXT NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(100) NOT NULL,
	zip INT NOT NULL
);

CREATE TABLE credit_cards(
	id SERIAL PRIMARY KEY,
	address_id INT NOT NULL,
	card_number INT NOT NULL,
	card_name VARCHAR(200) NOT NULL
);

CREATE TABLE transactions(
	id SERIAL PRIMARY KEY,
	credit_card_id INT REFERENCES credit_cards(id),
	total_price MONEY NOT NULL
);

CREATE TABLE shippings(
	id SERIAL PRIMARY KEY,
	address_id INT REFERENCES addresses(id) NOT NULL,
	shipping_method VARCHAR(250) NOT NULL,
	shipping_charge MONEY NOT NULL,
	shipping_estimated_delivery_day DATE
	);

CREATE TABLE orders(
	id SERIAL PRIMARY KEY,
	transaction_id INT REFERENCES transactions(id) NOT NULL,
	user_id INT REFERENCES users(id) NOT NULL,
	product_id INT REFERENCES products(id) NOT NULL,
	quantity INT NOT NULL,
	shipping_id int REFERENCES shippings(id) NOT null,
	order_date DATE NOT NULL,
	total_amount MONEY NOT NULL
);

ALTER TABLE users ADD COLUMN creditcard_id INT REFERENCES credit_cards(id)