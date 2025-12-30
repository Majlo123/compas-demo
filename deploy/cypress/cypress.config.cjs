const { defineConfig } = require("cypress");
const webpack = require("@cypress/webpack-preprocessor");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: "src/e2e/**/*.cy.{js,ts}",
    supportFile: "src/support/e2e.ts",
    fixturesFolder: "src/fixtures",

    setupNodeEvents(on) {
      on(
        "file:preprocessor",
        webpack({
          webpackOptions: {
            resolve: {
              extensions: [".ts", ".js"],
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  exclude: /node_modules/,
                  use: {
                    loader: "ts-loader",
                    options: {
                      configFile: path.resolve(
                        __dirname,
                        "tsconfig.cypress.json"
                      ),
                    },
                  },
                },
              ],
            },
          },
        })
      );
    },
  },
});
