const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "amzn123";

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS userProducts;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        firstName VARCHAR(25),
        lastName VARCHAR(25),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        price INTEGER NOT NULL,
        stock INTEGER DEFAULT 5 NOT NULL
    );
    CREATE TABLE userProducts(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        quantity INTEGER NOT NULL,
        purchased BOOLEAN DEFAULT FALSE
        );
    `;
  await client.query(SQL);
};

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  is_admin,
}) => {
  const SQL = `
INSERT INTO users(id, firstName, lastName, email, password, is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
`;
  const response = await client.query(SQL, [
    uuid.v4(),
    firstName,
    lastName,
    email,
    await bcrypt.hash(password, 5),
    is_admin,
  ]);
  return response.rows[0];
};

const createProduct = async ({ name, description, image, price, stock }) => {
  const SQL = `
INSERT INTO products(id, name, description, image, price, stock) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
`;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    description,
    image,
    price,
    stock,
  ]);
  return response.rows[0];
};

const createUserProduct = async ({
  user_id,
  product_id,
  quantity,
  purchased,
}) => {
  const SQL = `
  INSERT INTO userProducts(id, user_id, product_id, quantity, purchased) VALUES($1, $2, $3, $4, $5) RETURNING *;
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
    purchased,
  ]);
  return response.rows[0];
};

const updateProduct = async ({
  id,
  name,
  description,
  image,
  price,
  stock,
}) => {
  const SQL = `
   UPDATE products
   SET name = $1, description = $2, image = $3, price = $4, stock = $5
   WHERE id = $6 RETURNING *;
   `;
  const response = await client.query(SQL, [
    name,
    description,
    image,
    price,
    stock,
    id,
  ]);
  return response.rows[0];
};

const updateUserProduct = async ({ id, quantity, purchased }) => {
  const SQL = `
UPDATE userProducts
SET quantity = $1, purchased = $2
WHERE id = $3 RETURNING *;
`;
  const response = await client.query(SQL, [quantity, purchased, id]);
  return response.rows[0];
};

const deleteProduct = async ({ id }) => {
  const SQL = `
  DELETE 
  FROM products
  WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const fetchUserProducts = async () => {
  const SQL = `
        SELECT * FROM userProducts;
        `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchSingleUserProduct = async ({ id }) => {
  const SQL = `
  SELECT * FROM userProducts WHERE id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const fetchProducts = async () => {
  const SQL = `
      SELECT * FROM products;
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUsers = async () => {
  const SQL = `
    SELECT * FROM users;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchSingleUser = async ({ id }) => {
  const SQL = `
  SELECT id, firstname, lastname, email, is_admin FROM users WHERE id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const fetchSingleProduct = async ({ id }) => {
  const SQL = `
  SELECT * FROM products WHERE id = $1;
   `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const deleteUserProduct = async ({ user_id, id }) => {
  const SQL = `
  DELETE 
  FROM userProducts
  WHERE user_id = $1 AND id = $2;
  `;
  await client.query(SQL, [user_id, id]);
};

const authenticate = async (email, password) => {
  const SQL = `
  SELECT id, password 
  FROM users 
  WHERE email = $1;
  `;
  const response = await client.query(SQL, [email]);
  const userInfo = response.rows;
  const compare = await bcrypt.compare(password, userInfo[0].password);
  if (!userInfo.length || compare === false) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = jwt.sign({ id: response.rows[0].id }, JWT);
  return { token };
};

const findUserWithToken = async (token) => {
  try {
    const payload = await jwt.verify(token, JWT);
    console.log("payload", payload);
    const id = payload.id;
    const SQL = `
    SELECT id, email FROM users WHERE id = $1;
    `;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  } catch (err) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
};

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    req.user = await findUserWithToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createUserProduct,
  fetchUserProducts,
  fetchProducts,
  fetchUsers,
  deleteUserProduct,
  fetchSingleUser,
  fetchSingleProduct,
  updateProduct,
  deleteProduct,
  fetchSingleUserProduct,
  updateUserProduct,
  authenticate,
  isLoggedIn,
  findUserWithToken,
};