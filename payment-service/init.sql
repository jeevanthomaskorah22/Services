CREATE DATABASE payment_service_db;
CREATE USER admin WITH ENCRYPTED PASSWORD 'secret';
GRANT ALL PRIVILEGES ON DATABASE payment_service_db TO admin;
