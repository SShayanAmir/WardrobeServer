CREATE DATABASE wardrobe;

CREATE TABLE brand(
    brand_id SERIAL PRIMARY KEY,
    coverTitle VARCHAR(60),
    galleryPhoto VARCHAR(1000)
);

CREATE TABLE product(
    product_id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    brand VARCHAR(60),
    title VARCHAR(60),
    description VARCHAR(2000),
    price INT,
    quantity INT,
    image1 VARCHAR(3000),
    image2 VARCHAR(3000),
    image3 VARCHAR(3000),
    category VARCHAR(60)
);

CREATE TABLE orderDetails(
    orderNumber SERIAL PRIMARY KEY,
    trackingNumber VARCHAR(1000),
    Cart VARCHAR(3000),
    paymentMethod VARCHAR(100),
    grandTotal INT,
    createdAtDate VARCHAR(100),
    status VARCHAR(100),
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    email VARCHAR(100),
    phoneNumber VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(100),
    postalCode VARCHAR(25),
    address VARCHAR(300)
);