/// <reference types="cypress" />

import { join } from 'path';

function fillEventFields(newEventData, form) {
  form.get('[name=name]').clear().type(newEventData.name);

  form
    .get('[name=startDate]')
    .click()
    .clear()
    .type(`${newEventData.startDate}{enter}`);

  form
    .get('[name=endDate]')
    .click()
    .clear()
    .type(`${newEventData.endDate}{enter}`);

  form.get('[name=type]').click();
  cy.get('.ant-select-dropdown').contains(newEventData.type).click();

  newEventData.toponyms.forEach((toponymName) => {
    form.get('[name=toponyms] input').click().type(toponymName);
    cy.get('.ant-select-dropdown')
      .contains(new RegExp(`^${toponymName}$`, 'i'))
      .click();
  });

  newEventData.persons.forEach((person) => {
    form.get('[name=persons] input').click().type(person);
    cy.get('.ant-select-dropdown')
      .contains(new RegExp(`^${person}$`, 'i'))
      .click();
  });
}

describe('Editor Page', () => {
  beforeEach(() => {
    cy.visit('/editor');
  });

  it('Searching by event name', () => {
    const eventName = 'Польско-тевтонская война';

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').each(($row) => {
      expect($row).include.text(eventName);
    });
  });

  it('Deleting element', () => {
    const eventName = 'Польско-тевтонская война';

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').contains(eventName).should('have.length', 1);

    cy.contains('Удалить').click();

    cy.get('.ant-popover-content').contains('Да').click();

    cy.searchEventByName(eventName);

    cy.get('table tbody tr').contains(eventName).should('have.length', 0);
  });

  it('Adding element with all fields (include optional)', () => {
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

    fillEventFields(newEventData, cy.get('@eventForm'));

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

  it('Editing of existing event', () => {
    const oldEventName = 'Брагин';
    const newEventData = {
      name: `Первая находка метеорита Брагин была сделана, по видимому, в 1807 году, во всяком случае, не позднее 1809 года.
      Одновременно было найдено два экземпляра в местности Куцовка, близ деревни Капоренки, ныне Брагинского района.
      Обе массы были обнаружены крестьянами указанной деревни на песчаных холмах среди болот, на расстоянии «почти ста саженей один от другого».
      `,
      startDate: '01.01.1807',
      endDate: '31.12.1809',
      type: 'метеорит',
      toponyms: ['Беларусь', 'Брагин'],
      persons: [],
    };

    cy.searchEventByName(oldEventName);

    cy.get('table tbody tr').contains(oldEventName).click();

    cy.get('.ant-drawer .ant-form').as('eventForm');

    cy.get('@eventForm').should('be.visible');

    fillEventFields(newEventData, cy.get('@eventForm'));

    cy.get('@eventForm').get('[data-id=save-button]').click();

    cy.get('@eventForm').should('not.exist');

    const [firstSentenceOfEventName] = newEventData.name.split('\n', 1);
    cy.searchEventByName(firstSentenceOfEventName);

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

  it('Clicking on export button starts file downloading', () => {
    cy.get('[data-id=export-button]').click();
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.readFile(join(downloadsFolder, 'events.json')).should('exist');
  });
});
