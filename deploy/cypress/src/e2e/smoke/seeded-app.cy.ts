import { HOME } from "../../support/constants";

describe("Seeded application", () => {
  beforeEach(() => {
    cy.visit(HOME);
  });

  it("shows warning levels seeded in the database", () => {
    cy.contains("Warning Levels");

    cy.contains("Warning level 1");
    cy.contains("warning level 1 description");

    cy.contains("Warning level 2");
    cy.contains("warning level 2 description");

    cy.contains("Warning level 3");
    cy.contains("warning level 3 description");

    cy.contains("Warning level 4");
    cy.contains("warning level 4 description");

    cy.contains("Warning level 5");
    cy.contains("warning level 5 description");
  });
});
