CREATE DATABASE order_service_db;

CREATE USER admin WITH ENCRYPTED PASSWORD 'secret';

GRANT ALL PRIVILEGES ON DATABASE order_service_db TO admin;

\c order_service_db;

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

INSERT INTO orders (user_id, product_id, quantity, total_price, status)
VALUES 
    (1, 101, 2, 199.98, 'processing'),
    (2, 102, 1, 89.99, 'completed');

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES 
    (1, 101, 2, 99.99),
    (2, 102, 1, 89.99);