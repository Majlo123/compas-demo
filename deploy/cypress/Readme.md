- Navigate to the project directory : `cd deploy/cypress/`
- Initialize new bun project :`bun init -y`
- Install Cypress using bun : `bun add cypress`
- For running Cypress in interactive use : `bun run cy:dev`
- For running Cypress in headless mode, use : `bun run cy:headless`

- For running Cypress in for CI/CD pipelines, use:
  ```shell
    docker-compose up -d
    docker-compose -f docker-compose.yml -f docker-compose.cypress.yml run --rm cypress
    docker-compose down -v
  ```
- Make sure to have the necessary environment files in Action.Variables before running in CI/CD:
  - CY_FRONTEND_ENV
  - CY_BACKEND_ENV
