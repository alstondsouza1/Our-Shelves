module.exports = {
  globalSetup: "./jest.global-setup.cjs",
  globalTeardown: "./jest.global-teardown.cjs",

  testMatch: [
    "**/books.integration.test.js"
  ],
  testTimeout: 30000,
  testEnvironment: 'node',
  transform: {},
};