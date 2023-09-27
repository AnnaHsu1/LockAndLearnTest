import App from "../../src/App";

describe("My First Test", () => {
  it("Verify Text", () => {
    cy.mount(<App />);
    // cy.get("StackNavigation").should("be.visible");
    // cy.get("Text").should("not.exist");
    cy.visit("http://localhost:19006/");
  });
});
