import mysql from "mysql2/promise";
import dotenv from "dotenv";

// loading environment variables (DB connection details)
dotenv.config();

const DB_HOST = process.env.TEST_DB_HOST || process.env.DB_HOST;
const DB_PORT = process.env.TEST_DB_PORT || process.env.DB_PORT || 3306;
const DB_USER = process.env.TEST_DB_USER || process.env.DB_USER;
const DB_PASSWORD = process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD;
const DB_NAME = process.env.TEST_DB_NAME || process.env.DB_NAME;

// create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// test the database connection
if (process.env.NODE_ENV !== "test") {
  pool.getConnection()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1);
  });
}

export default pool;
