Cypress.Commands.add('searchEventByName', (text) => {
  cy.get('[data-id=search]').clear();
  cy.get('[data-id=search]').type(`${text}{enter}`);
});
