DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(12editioning 0,4) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES
("Yoga Mat","sports", 29, 100),
("Table","furniture", 99.10, 50),
("iPad","electronics", 299, 300),
("Travel Bag","travel gear", 19.99, 500),
("Alarm Clock","clocks", 8.77, 150),
("Microphone","music", 24.99, 87),
("Pinguin Toy","toys", 2.99, 50),
("Sippy Cup","kitchen", 999, 900),
("Led Light","electronics", 20.08, 200),
("Bike","toys and games", 159, 700);