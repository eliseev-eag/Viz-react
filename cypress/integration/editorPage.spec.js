/// <reference types="cypress" />

describe('Editor Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Search by event name works', () => {
    const eventName = 'Польско-тевтонская война';

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').each(($row) => {
      expect($row).include.text(eventName);
    });
  });

  it('Delete element works', () => {
    const eventName = 'Польско-тевтонская война';

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').contains(eventName).should('have.length', 1);

    cy.contains('Удалить').click();

    cy.get('.ant-popover-content').contains('Да').click();

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').contains(eventName).should('have.length', 0);
  });

  it('Add element with all fields (include optional)', () => {
    const newEventData = {
      name: 'Holy JS Moscow 2021',
      startDate: '02.11.2021',
      endDate: '05.11.2021',
      type: 'конференция',
      toponyms: ['Москва', 'Россия'],
      persons: ['Столлман Ричард', 'Торвальдс Линус'],
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

    newEventData.toponyms.forEach((toponymName) => {
      cy.get('@eventForm')
        .get('[name=toponyms] input')
        .click()
        .type(toponymName);
      cy.get('.ant-select-dropdown')
        .contains(new RegExp(`^${toponymName}$`, 'i'))
        .click();
    });

    newEventData.persons.forEach((person) => {
      cy.get('@eventForm').get('[name=persons] input').click().type(person);
      cy.get('.ant-select-dropdown')
        .contains(new RegExp(`^${person}$`, 'i'))
        .click();
    });

    cy.get('@eventForm').get('[data-id=save-button]').click();

    cy.get('@eventForm').should('not.exist');

    cy.get('.ant-message').contains('Событие успешно добавлено');

    cy.searchEventByName(newEventData.name);

    cy.get('table tbody tr').as('row').should('have.length', 1);
    cy.get('@row')
      .should('contain.text', newEventData.name)
      .and('contain.text', newEventData.startDate)
      .and('contain.text', newEventData.endDate)
      .and('contain.text', newEventData.type);

    newEventData.persons.forEach((person) => {
      cy.get('@row').invoke('text').should('match', new RegExp(person, 'i'));
    });

    newEventData.toponyms.forEach((toponym) => {
      cy.get('@row').invoke('text').should('match', new RegExp(toponym, 'i'));
    });
  });
});
