// jest.setup.js
import { MySQLTest } from '@database/mysql-test';
import { jest } from '@jest/globals';

// A variable to hold the test container instance
let mysqlTestContainer;

// --- Global Setup (Before all tests) ---
export async function setup() {
  // Set the NODE_ENV to 'test' so db.js knows not to run the connection check
  process.env.NODE_ENV = 'test';

  console.log('\nSetting up temporary MySQL database container...');
  
  // 1. Initialize the MySQL Test Container
  mysqlTestContainer = new MySQLTest({});

  // 2. Start the container and get the connection details
  const { 
    host, 
    port, 
    user, 
    password, 
    database 
  } = await mysqlTestContainer.start();

  // 3. Set the environment variables that db.js will use
  process.env.TEST_DB_HOST = host;
  process.env.TEST_DB_PORT = port;
  process.env.TEST_DB_USER = user;
  process.env.TEST_DB_PASSWORD = password;
  process.env.TEST_DB_NAME = database;
  
  console.log(`MySQL Test DB is running on ${host}:${port}`);
}

// --- Global Teardown (After all tests) ---
export async function teardown() {
  if (mysqlTestContainer) {
    console.log('\nStopping and cleaning up temporary MySQL database container...');
    await mysqlTestContainer.stop();
    console.log('MySQL Test DB stopped.');
  }
}