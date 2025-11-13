/** @type {import('jest').Config} */
const config = {
   testEnvironment: "node",
   clearMocks: true,
   transform: {},

   testPathIgnorePatterns: ["/node_modules/", "books.integration.test.js"],
};

export default config;
