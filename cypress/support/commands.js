Cypress.Commands.add('searchEventByName', (text) => {
  cy.get('[data-id=search]').clear().type(`${text}{enter}`);
});
