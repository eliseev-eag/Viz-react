/// <reference types="cypress" />

describe('Editor Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');

    cy.get('[data-id=search]').as('search');
  });

  it('Search by event name works', () => {
    const eventName = 'Польско-тевтонская война';

    cy.get('@search').type(`${eventName}{enter}`);

    cy.get('table tbody tr').each(($row) => {
      expect($row).include.text(eventName);
    });
  });

  it('Delete element works', () => {
    const eventName = 'Польско-тевтонская война';

    cy.get('@search').type(`${eventName}{enter}`);

    cy.get('table tbody tr').contains(eventName).should('have.length', 1);

    cy.contains('Удалить').click();

    cy.get('.ant-popover-content').contains('Да').click();

    cy.get('@search').clear().type(`${eventName}{enter}`);

    cy.get('table tbody tr').contains(eventName).should('have.length', 0);
  });

  it('Add element with required fields', () => {
    const newEventData = {
      name: 'Holy JS Moscow 2021',
      startDate: '02.11.2021',
      endDate: '05.11.2021',
      type: 'катастрофа',
    };

    cy.get('[data-id=add-button]').click();

    cy.get('.ant-drawer .ant-form').as('eventForm');

    cy.get('@eventForm').should('be.visible');

    cy.get('@eventForm').get('[name=name]').type(newEventData.name);
    cy.get('@eventForm')
      .get('[name=startDate]')
      .click()
      .type(`${newEventData.startDate}{enter}`);
    cy.get('@eventForm')
      .get('[name=endDate]')
      .click()
      .type(`${newEventData.endDate}{enter}`);
    cy.get('@eventForm').get('[name=type] input').click();
    cy.get('.ant-select-dropdown').contains(newEventData.type).click();

    cy.get('@eventForm').get('[data-id=save-button]').click();
    cy.get('@eventForm').should('not.exist');

    cy.get('.ant-message').contains('Событие успешно добавлено');

    cy.get('@search').type(`${newEventData.name}{enter}`);
    cy.get('table tbody tr').as('row').should('have.length', 1);
    cy.get('@row').should('contain.text', newEventData.name);
    cy.get('@row').should('contain.text', newEventData.startDate);
    cy.get('@row').should('contain.text', newEventData.endDate);
    cy.get('@row').should('contain.text', newEventData.type);
  });
});
