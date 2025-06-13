CREATE USER user WITH ENCRYPTED PASSWORD 'pass';
CREATE DATABASE productdb OWNER user;

\c productdb;

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC,
    stock INT
);
