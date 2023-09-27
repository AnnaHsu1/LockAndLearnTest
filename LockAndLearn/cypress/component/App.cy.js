// import App from "../../App.js";

// import Button from './Button'

// it('uses custom text for the button label', () => {
//   cy.mount(<Button>Click me!</Button>)
//   cy.get('button').should('contains.text', 'Click me!')
// })

describe('My First Test', () => {

  it('Verify Text', () => {

      // cy.get("StackNavigation").should("be.visible");
      cy.get("Text").should("not.exist");
      cy.visit("http://localhost:19006/");

  });

})