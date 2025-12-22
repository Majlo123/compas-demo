import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    setupNodeEvents(on, config) {
      return config;
    },

    specPattern: "src/e2e/**/*.cy.{js,ts}",
    supportFile: "src/support/e2e.ts",
    fixturesFolder: "src/fixtures",
  },
});
