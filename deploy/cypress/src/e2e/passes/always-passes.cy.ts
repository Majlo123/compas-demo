import { HOME } from "../../support/constants";

describe("Always passes", () => {
  it("Should always pass", () => {
    cy.visit(HOME);
    expect(true).to.equal(true);
  });
});
