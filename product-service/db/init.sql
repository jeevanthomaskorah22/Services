CREATE DATABASE product_service_db;

\c product_service_db

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC,
    stock INT,
);
