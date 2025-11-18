import { defineConfig } from "cypress";

export default defineConfig({
   e2e: {
      baseUrl: "http://localhost:5173",

      supportFile: 'cypress/support/e2e.js',
      specPattern: 'cypress/e2e/**/*.cy.js',

      video: true,
      screenshotOnRunFailure: true,

      viewportHeight: 1280,
      viewportWidth: 720,

      env: {
         apiUrl: 'http://localhost:3000'
      }
   },
});