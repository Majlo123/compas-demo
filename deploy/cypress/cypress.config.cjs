const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,

    specPattern: "src/e2e/**/*.cy.{js,ts}",
    supportFile: "src/support/e2e.ts",
    fixturesFolder: "src/fixtures",
  },
});
