const { defineConfig } = require("cypress");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: "src/e2e/**/*.cy.{js,ts}",
    supportFile: "src/support/e2e.ts",
    fixturesFolder: "src/fixtures",

    setupNodeEvents(on) {
      on(
        "file:preprocessor",
        webpackPreprocessor({
          webpackOptions: {
            resolve: {
              extensions: [".ts", ".js"],
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  exclude: /node_modules/,
                  use: [
                    {
                      loader: "ts-loader",
                      options: {
                        configFile: "tsconfig.cypress.json",
                      },
                    },
                  ],
                },
              ],
            },
          },
        })
      );
    },
  },
});
