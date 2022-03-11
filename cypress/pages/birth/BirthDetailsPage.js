'use strict';

const DetailsPage = require('../DetailsPage');

class BirthDetailsPage extends DetailsPage {

  static recordSummaryDisplayed(record) {
    DetailsPage.shouldBeVisible();
    cy.get('h1').contains(`${record.child.name.fullName} ${record.child.dateOfBirth}`);
}

  static recordDisplayed(record) {
    cy.get('h1').contains(`${record.child.name.fullName} ${record.child.dateOfBirth}`);
    cy.get('.details').contains(`System number ${record.systemNumber}`);
    cy.get('.details').contains(`Surname ${record.child.name.surname}`);
    cy.get('.details').contains(`Forename(s) ${record.child.name.givenName}`);
    cy.get('.details').contains(`Date of birth ${record.child.dateOfBirth}`);
    cy.get('.details').contains(`Place of birth ${record.child.birthplace}`);
    cy.get('.details').contains(`Sex ${record.child.sex}`);
    cy.get('.details').contains(`Name ${record.mother.name.fullName}`);
    cy.get('.details').contains(`Maiden name ${record.mother.maidenSurname}`);
    cy.get('.details').contains(`Surname at marriage if different from maiden name ${record.mother.marriageSurname}`);
    cy.get('.details').contains(`Place of birth ${record.mother.birthplace}`);
    cy.get('.details').contains(`Name ${record.father.name.fullName}`);
    cy.get('.details').contains(`Place of birth ${record.father.birthplace}`);
    cy.get('.details').contains('Birth registered by Mother');
    cy.get('.details').contains(`Registration district ${record.registrationDistrict}`);
    cy.get('.details').contains(`Administrative area ${record.administrativeArea}`);
    cy.get('.details').contains(`Date of registration ${record.date}`);
  }

  static clickNewSearchLink() {
    cy.get('#newSearchLink').click();
  }

  static clickEditSearchLink() {
    cy.get('#editSearchLink').click();
  }

  static clickBackToResultsLink() {
    cy.get('#backToSearchResults').click();
  }

  static editSearchLinkVisible() {
    cy.get('a').contains('Edit search');
  }

  static backToSearchResultsDisplayed() {
    cy.get('#backToSearchResults').should('exist');
  }

  static backToSearchResultsNotDisplayed() {
    cy.get('#backToSearchResults').should('not.exist');
  }
}

module.exports = BirthDetailsPage;
