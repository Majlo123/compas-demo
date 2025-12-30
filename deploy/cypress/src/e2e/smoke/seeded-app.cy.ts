import { HOME } from "../../support/constants";

describe("Seeded application", () => {
  beforeEach(() => {
    cy.visit(HOME);
  });

  it("shows warning levels seeded in the database", () => {
    cy.contains("PAR Level Management");

    cy.contains("Warning level 1");
    cy.contains("Level 1");

    cy.contains("Warning level 2");
    cy.contains("Level 2");

    cy.contains("Warning level 3");
    cy.contains("Level 3");

    cy.contains("Warning level 4");
    cy.contains("Level 4");

    cy.contains("Warning level 5");
    cy.contains("Level 5");
  });
});
