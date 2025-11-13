const { MySqlContainer } = require("@testcontainers/mysql");

const dropBooksSql = `DROP TABLE IF EXISTS books;`;
const dropUsersSql = `DROP TABLE IF EXISTS users;`;

const createUsersSql = `
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createBooksSql = `
  CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    genre VARCHAR(100),
    description VARCHAR(500),
    year INT,
    cover VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );
`;

module.exports = async () => {
   process.env.NODE_ENV = "test";
   console.log("\nSetting up temporary MySQL database container...");

   const mysqlTestContainer = await new MySqlContainer("mysql:8").start();

   const host = mysqlTestContainer.getHost();
   const port = mysqlTestContainer.getMappedPort(3306);

   process.env.TEST_DB_HOST = host;
   process.env.TEST_DB_PORT = port;
   process.env.TEST_DB_USER = mysqlTestContainer.getUsername();
   process.env.TEST_DB_PASSWORD = mysqlTestContainer.getUserPassword();
   process.env.TEST_DB_NAME = mysqlTestContainer.getDatabase();

   global.__MYSQL_TEST_CONTAINER__ = mysqlTestContainer;

   console.log(`MySQL Test DB is running on ${host}:${port}`);

   try {
      const dbModule = await import("./db.js");
      const db = dbModule.default;

      await db.execute(dropBooksSql);
      await db.execute(dropUsersSql);
      console.log("Existing tables dropped (if any).");

      await db.execute(createUsersSql);
      console.log("Table 'users' created.");
      await db.execute(createBooksSql);
      console.log("Table 'books' created.");
   } catch (err) {
      console.error("Error creating tables:", err.message);
      throw err;
   }
};
